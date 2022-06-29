import { ChainId } from '@webb-dapp/apps/configs';

export type RelayedChainConfig = {
  account: string;
  beneficiary?: string;
  contracts: Contract[];
};
export type Capabilities = {
  hasIpService: boolean;
  supportedChains: {
    substrate: Map<ChainId, RelayedChainConfig>;
    evm: Map<ChainId, RelayedChainConfig>;
  };
};

export interface Contract {
  contract: string;
  address: string;
  deployedAt: number;
  eventsWatcher: EventsWatcher;
  size: number;
  withdrawFeePercentage: number;
  linkedAnchors: LinkedAnchor[];
}

export interface LinkedAnchor {
  chain: string;
  address: string;
}

export interface EventsWatcher {
  enabled: boolean;
  pollingInterval: number;
}

export type RelayerConfig = {
  endpoint: string;
};

export interface Withdraw {
  finalized?: Finalized;
  errored?: Errored;
  connected?: string;
  connecting?: string;
}

export interface Finalized {
  txHash: string;
}

export interface Errored {
  reason: string;
}

export type RelayerMessage = {
  withdraw?: Withdraw;
  error?: string;
  network?: string;
};
export type RelayerCMDBase = 'evm' | 'substrate';
export type MixerRelayTx = {
  chain: string;
  // Tree ID (Mixer tree id)
  id: number;
  proof: Array<number>;
  root: Array<number>;
  nullifierHash: Array<number>;
  // Ss558 Format
  recipient: string;
  // Ss558 Format
  relayer: string;
  fee: number;
  refund: number;
};

type TornadoRelayTransaction = {
  chain: string;
  // The target contract.
  contract: string;
  // Proof bytes
  proof: string;
  // Fixed length Hex string
  fee: string;
  nullifierHash: string;
  recipient: string;
  // Fixed length Hex string
  refund: string;
  relayer: string;
  root: string;
};
type AnchorRelayTransaction = {
  chain: string;
  // The target contract.
  contract: string;
  // Proof bytes
  proof: string;
  // Fixed length Hex string
  fee: string;
  nullifierHash: string;
  recipient: string;
  // Fixed length Hex string
  refund: string;
  relayer: string;
  refreshCommitment: string;
  roots: Array<number>;
};

/**
 * Proof data object for VAnchor proofs on any chain
 *
 * @param proof - Encoded proof data
 * @param publicAmount - Public amount for proof
 * @param roots - Merkle roots for the proof
 * @param inputNullifiers - nullifer hashes for the proof
 * @param outputCommitments - Output commitments for the proof
 * @param extDataHash - External data hash for the proof external data
 * */
type ProofData = {
  proof: Array<number>;
  publicAmount: Array<number>;
  roots: Array<number>[];
  inputNullifiers: Array<number>[];
  outputCommitments: Array<number>[];
  extDataHash: Array<number>;
};

/**
 * External data for the VAnchor on any chain
 *
 * @param recipient -  Recipient identifier of the withdrawn funds
 * @param relayer - Relayer identifier of the transaction
 * @param extAmount - External amount being deposited or withdrawn withdrawn
 * @param fee - Fee to pay the relayer
 * @param encryptedOutput1 - First encrypted output commitment
 * @param encryptedOutput2 - Second encrypted output commitment
 * */
type ExtData = {
  recipient: string;
  relayer: string;
  extAmount: Array<number>[];
  fee: number;
  encryptedOutput1: Array<number>;
  encryptedOutput2: Array<number>;
};

/**
 * Contains data that is relayed to the VAnchors
 * @param chain - One of the supported chains of this relayer
 * @param id - The tree id of the mixer's underlying tree
 * @param proofData - The zero-knowledge proof data structure for VAnchor transactions
 * @param extData - The external data structure for arbitrary inputs
 * */
type VAnchorRelayedTransaction = {
  chain: string;
  id: number;
  proofData: ProofData;
  extData: ExtData;
};

export type RelayerSubstrateCommands = {
  mixerRelayTx: MixerRelayTx;
  vanchorRelayTx: VAnchorRelayedTransaction;
};
export type RelayerEVMCommands = {
  tornadoRelayTx: TornadoRelayTransaction;
  anchorRelayTx: AnchorRelayTransaction;
  vanchorRelayTx: VAnchorRelayedTransaction;
};
export type EVMCMDKeys = keyof RelayerEVMCommands;
export type SubstrateCMDKeys = keyof RelayerSubstrateCommands;
export type RelayerCMDKey = EVMCMDKeys | SubstrateCMDKeys;
