import {
  NoteGenPayload,
  Notes,
  TransactParams,
  VAnchorTransact,
} from '@webb-tools/abstract-api-provider/vanchor/vanchor-transact';
import { WebbWeb3Provider } from '../webb-provider';
import { LoggerService } from '@webb-tools/browser-utils';
import {
  FixturesStatus,
  NewNotesTxResult,
  Transaction,
} from '@webb-tools/abstract-api-provider';
import { ethers } from 'ethers';
import {
  calculateTypedChainId,
  ChainType,
  CircomUtxo,
  Keypair,
  Note,
  NoteGenInput,
  toFixedHex,
} from '@webb-tools/sdk-core';
import {
  fetchVAnchorKeyFromAws,
  fetchVAnchorWasmFromAws,
} from '@webb-tools/fixtures-deployments';

export class Web3VanchorTransact extends VAnchorTransact<WebbWeb3Provider> {
  private logger = LoggerService.get('Web3VanchorTransact');
  async generateNote(
    anchorId: string,
    destChainId: string,
    amount: string,
    wrappableAssetIdentifier: string
  ): Promise<NoteGenPayload> {
    this.logger.trace('generateBridgeNote: ', anchorId, destChainId, amount);
    const bridge = this.inner.methods.bridgeApi.getBridge();
    const currency = bridge?.currency;

    if (!bridge || !currency) {
      this.logger.error('Api not ready');
      throw new Error('api not ready');
    }
    // Convert the amount to bn units (i.e. WEI instead of ETH)
    const bnAmount = ethers.utils
      .parseUnits(amount.toString(), currency.getDecimals())
      .toString();
    const tokenSymbol = currency.view.symbol;
    const sourceEvmId = await this.inner.getChainId();
    const sourceChainId = calculateTypedChainId(ChainType.EVM, sourceEvmId);

    const keypair = this.inner.noteManager
      ? this.inner.noteManager.getKeypair()
      : new Keypair();

    this.logger.info('got the keypair', keypair);

    // Convert the amount to units of wei
    const depositOutputUtxo = await CircomUtxo.generateUtxo({
      curve: 'Bn254',
      backend: 'Circom',
      amount: bnAmount,
      originChainId: sourceChainId.toString(),
      chainId: destChainId.toString(),
      keypair,
    });

    this.logger.info('generated the utxo: ', depositOutputUtxo.serialize());

    const srcAddress = bridge.targets[sourceChainId];
    const destAddress = bridge.targets[destChainId];

    const noteInput: NoteGenInput = {
      amount: bnAmount.toString(),
      backend: 'Circom',
      curve: 'Bn254',
      denomination: '18',
      exponentiation: '5',
      hashFunction: 'Poseidon',
      protocol: 'vanchor',
      secrets: [
        toFixedHex(destChainId, 8).substring(2),
        toFixedHex(depositOutputUtxo.amount, 16).substring(2),
        toFixedHex(keypair.privkey).substring(2),
        toFixedHex(`0x${depositOutputUtxo.blinding}`).substring(2),
      ].join(':'),
      sourceChain: sourceChainId.toString(),
      sourceIdentifyingData: srcAddress,
      targetChain: destChainId.toString(),
      targetIdentifyingData: destAddress,
      tokenSymbol: tokenSymbol,
      version: 'v1',
      width: '5',
    };

    this.logger.log('before generating the note: ', noteInput);

    const note = await Note.generateNote(noteInput);

    this.logger.log('after generating the note');

    return {
      note,
      anchorId,
      wrappableAssetIdentifier,
    };
  }

  private getTransactionName(params:TransactParams):'Deposit'|'Withdraw'|"Transfer"{
    const notesAmount = params.notes.reduce(note =>  , []);
  }

  async transact(params: TransactParams): Promise<Transaction<Notes>> {
    const { notes, anchorId, recipient, wrapUnwrapAssetIdentifier, amount } =
      params;

    const metaDataNote = notes[0].note;
    const srcChainId = metaDataNote.sourceChainId;
    const formattedAmount = ethers.utils.formatUnits(
      amount,
      metaDataNote.denomination
    );

    const destChainId = metaDataNote.targetChainId;
    const currencySymbol = metaDataNote.tokenSymbol;

    const srcSymbol = this.inner.config.getCurrencyByAddress(
      wrapUnwrapAssetIdentifier
    ).symbol;
    const txType = 'Deposit';
    const tx = Transaction.new<Notes>(txType, {
      wallets: { src: Number(srcChainId), dist: Number(destChainId) },
      tokens: [srcSymbol, currencySymbol],
      token: currencySymbol,
      amount: Number(formattedAmount),
    });

    const transactionExecutor = async (): Promise<Notes> => {
      const abortSignal = tx.cancelToken.abortSignal;

      const bridge = this.inner.methods.bridgeApi.getBridge();
      const currency = bridge?.currency;

      this.logger.log('bridge: ', bridge);
      this.logger.log('currency: ', currency);

      if (!bridge || !currency) {
        tx.fail('api not ready');
      }
    };

    tx.executor(transactionExecutor);

    return tx;
  }

  /**
   * Fetch the vAnchor fixtures
   * */
  private static async fetchFixtures(
    maxEdges: number,
    small: boolean,
    abortSignal: AbortSignal,
    fixturesList: Map<string, FixturesStatus>
  ) {
    fixturesList.set('VAnchorKey', 'Waiting');
    fixturesList.set('VAnchorWasm', 'Waiting');
    fixturesList.set('VAnchorKey', 0);
    const provingKey = await fetchVAnchorKeyFromAws(
      maxEdges,
      small,
      abortSignal
    );
    fixturesList.set('VAnchorKey', 'Done');
    fixturesList.set('VAnchorWasm', 0);
    const wasmBuffer = await fetchVAnchorWasmFromAws(
      maxEdges,
      small,
      abortSignal
    );
    fixturesList.set('VAnchorWasm', 'Done');
    return {
      provingKey,
      wasmBuffer,
    };
  }
}
