import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  Table as RTTable,
} from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ExternalLinkLine, TokenIcon } from '@webb-tools/icons';
import {
  Button,
  fuzzyFilter,
  KeyValueWithButton,
  Typography,
  Table,
  shortenString,
  TokenWithAmount,
} from '@webb-tools/webb-ui-components';
import { SpendNoteDataType } from './types';
import { randRecentDate } from '@ngneat/falso';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWebContext } from '@webb-tools/api-provider-environment';
import { calculateTypedChainId, ChainType, parseTypedChainId } from '@webb-tools/sdk-core';
import { ethers } from 'ethers';
import { Web3Provider } from '@webb-tools/web3-api-provider';
import { chainsPopulated, currenciesConfig } from '@webb-tools/dapp-config';
import { VAnchorContract } from '@webb-tools/evm-contracts';
import { useNoteAccount } from '@webb-tools/react-hooks';

const columnHelper = createColumnHelper<SpendNoteDataType>();

const columns: ColumnDef<SpendNoteDataType, any>[] = [
  columnHelper.accessor('chain', {
    header: 'Chain',
    cell: (props) => <TokenIcon size="lg" name={props.getValue<string>()} />,
  }),

  columnHelper.accessor('governedTokenSymbol', {
    header: 'Shielded Asset',
    cell: (props) => {
      const token1Symbol = props.getValue<string>();
      const tokenUrl = props.row.original.assetsUrl;

      return (
        <div className="flex items-center space-x-1.5">
          <TokenWithAmount token1Symbol={token1Symbol} />

          <a href={tokenUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLinkLine />
          </a>
        </div>
      );
    },
  }),

  columnHelper.accessor('balance', {
    header: 'Available Balance',
    cell: (props) => (
      <Typography variant="body1" fw="bold">
        {props.getValue()}
      </Typography>
    ),
  }),

  columnHelper.accessor('createdTime', {
    header: 'Created',
    cell: (props) => formatDistanceToNow(props.getValue<Date>()),
  }),

  columnHelper.accessor('subsequentDeposits', {
    header: 'Subsequent deposits',
    cell: (props) => (
      <Typography ta="center" variant="body1">
        {props.getValue()}
      </Typography>
    ),
  }),

  columnHelper.accessor('note', {
    header: 'Note',
    cell: (props) => (
      <KeyValueWithButton
        shortenFn={(note: string) => shortenString(note, 4)}
        isHiddenLabel
        size="sm"
        keyValue={props.getValue()}
      />
    ),
  }),

  columnHelper.accessor('assetsUrl', {
    header: '',
    cell: () => {
      return (
        <Button variant="utility" size="sm" className="p-2">
          <ChevronDown className="!fill-current" />
        </Button>
      );
    },
  }),
];

const assetsUrl = 'https://webb.tools';

const data: SpendNoteDataType[] = [
  {
    chain: 'matic',
    governedTokenSymbol: 'WebbETH',
    assetsUrl,
    createdTime: randRecentDate(),
    subsequentDeposits: 0,
    note: 'webb://v1:vanchor/1099511628196:1099511628196/0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f:0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f/00000100000001a4:00000000000000000de0b6b3a7640000:215beaaaf3c9789e7fceda50314e2c2448c0faa12d0a0f15bf1ba20bea484cda:002b9d68d5bdddf2f16fdaa209a1947ff9430a644381576a70ffe39309f736d7/?curve=Bn254&width=5&exp=5&hf=Poseidon&backend=Circom&token=webbETH&denom=18&amount=1000000000000000000',
    balance: 0.654,
  },
  {
    chain: 'matic',
    governedTokenSymbol: 'WebbETH',
    assetsUrl,
    createdTime: randRecentDate(),
    subsequentDeposits: 8,
    note: 'webb://v1:vanchor/1099511628196:1099511628196/0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f:0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f/00000100000001a4:00000000000000000de0b6b3a7640000:215beaaaf3c9789e7fceda50314e2c2448c0faa12d0a0f15bf1ba20bea484cda:002b9d68d5bdddf2f16fdaa209a1947ff9430a644381576a70ffe39309f736d7/?curve=Bn254&width=5&exp=5&hf=Poseidon&backend=Circom&token=webbETH&denom=18&amount=1000000000000000000',
    balance: 0.22,
  },
  {
    chain: 'matic',
    governedTokenSymbol: 'WebbUSDC',
    assetsUrl,
    createdTime: randRecentDate(),
    subsequentDeposits: 88,
    note: 'webb://v1:vanchor/1099511628196:1099511628196/0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f:0xc3393b00a5c6a7250a5ee7ef99f0a06ff29bc18f/00000100000001a4:00000000000000000de0b6b3a7640000:215beaaaf3c9789e7fceda50314e2c2448c0faa12d0a0f15bf1ba20bea484cda:002b9d68d5bdddf2f16fdaa209a1947ff9430a644381576a70ffe39309f736d7/?curve=Bn254&width=5&exp=5&hf=Poseidon&backend=Circom&token=webbETH&denom=18&amount=1000000000000000000',
    balance: 500,
  },
];

export const SpendNotesTableContainer: React.FC = () => {
  const { noteManager } = useWebContext();
  const { allNotes } = useNoteAccount();

  const [notes, setTableNotes] = useState<SpendNoteDataType[]>([]);

  const getBalancesForChain = useCallback(
    (typedChainId: string): Map<string, number> => {
      const chainBalances: Map<string, number> = new Map();
      const chainGroupedNotes = allNotes.get(typedChainId);

      if (!chainGroupedNotes) {
        return new Map();
      }

      chainGroupedNotes.forEach((note) => {
        const assetBalance = chainBalances.get(note.note.tokenSymbol);
        if (!assetBalance) {
          chainBalances.set(
            note.note.tokenSymbol,
            Number(ethers.utils.formatUnits(note.note.amount, note.note.denomination))
          );
        } else {
          chainBalances.set(
            note.note.tokenSymbol,
            assetBalance + Number(ethers.utils.formatUnits(note.note.amount, note.note.denomination))
          );
        }
      });

      return chainBalances;
    },
    [allNotes]
  );

  useEffect(() => {
    if (noteManager) {
      console.group('Debug')
      // Build up all providers that are required for chain queries
      const providersToQuerySubsequentDeposits = Array.from(allNotes.entries()).reduce((acc, entry) => {
        const detectedChainTypeId = parseTypedChainId(Number(entry[0]));

        console.log('detectedChainTypeId', detectedChainTypeId)

        // Map over the notes in the entry and create a provider for the sourceChainId if it doesn't exist
        entry[1].forEach((note) => {
          if (!acc[(note.note.sourceChainId)]) {
            acc[note.note.sourceChainId] =
              Web3Provider.fromUri(chainsPopulated[Number(note.note.sourceChainId)].url).intoEthersProvider();
          }
        })
        
        return acc;
      }, {} as Record<string, ethers.providers.Web3Provider>)
      console.groupEnd()

      Array.from(allNotes.entries()).forEach((chainGroupedNotes) => {
        const promises: Promise<SpendNoteDataType>[] = chainGroupedNotes[1].map(async (note) => {
          // For each note, look at the sourceChain and create the contract instance
          const address = note.note.sourceIdentifyingData;
          const typedChainId = note.note.sourceChainId;
          const contract = new VAnchorContract(providersToQuerySubsequentDeposits[typedChainId], address, true);

          // Get the information about the chain
          const chain = chainsPopulated[Number(chainGroupedNotes[0])];
          const chainGroupedBalances = getBalancesForChain(chainGroupedNotes[0]);

          if (!notes.find((storedNote) => {
            return storedNote.note === note.serialize();
          })) {
            return contract.getNextIndex().then((nextIndex) => {
              const subsequentDepositsNumber = nextIndex - Number(note.note.index);
              return {
                governedTokenSymbol: note.note.tokenSymbol,
                chain: chain.name.toLowerCase(),
                note: note.serialize(),
                assetsUrl,
                createdTime: randRecentDate(),
                balance: chainGroupedBalances.get(note.note.tokenSymbol) ?? 0,
                subsequentDeposits: subsequentDepositsNumber
              }
            });  
          }
        })

        Promise.all(promises).then()
      })
    }
  }, [allNotes, getBalancesForChain, noteManager])

  const table = useReactTable({
    data: notes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  return (
    <div className="overflow-hidden rounded-lg bg-mono-0 dark:bg-mono-180">
      <Table
        thClassName="border-t-0 bg-mono-0 dark:bg-mono-160"
        tdClassName="min-w-max"
        tableProps={table as RTTable<unknown>}
        isPaginated
        totalRecords={notes.length}
      />
    </div>
  );
};
