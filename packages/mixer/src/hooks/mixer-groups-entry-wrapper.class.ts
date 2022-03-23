import { Currency } from '@webb-tools/api-providers/webb-context/currency/currency';
import { Token } from '@webb-tools/sdk-core';
import { Balance, PalletMixerMixerMetadata as MixerInfo } from '@webb-tools/types/interfaces';

import { StorageKey } from '@polkadot/types';

export type NativeTokenProperties = {
  ss58Format: number | null;
  tokenDecimals: Array<number> | null;
  tokenSymbol: Array<string> | null;
};

export type MixerGroupItem = {
  id: number;
  amount: Balance;
  currency: Currency;
  token: Token;
};
export type MixerGroupEntry = [StorageKey, MixerInfo];
