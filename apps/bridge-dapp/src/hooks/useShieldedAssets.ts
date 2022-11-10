import { ShieldedAssetDataType } from '../containers/ShieldedAssetsTableContainer/types';

// Temporary hardcoded data for table displaying
const data: ShieldedAssetDataType[] = [
  {
    chain: 'matic',
    token1Symbol: 'WebbETH',
    token2Symbol: 'WETH',
    assetsUrl: 'https://webb.tools',
    availableBalance: 1.645,
    numberOfNotesFound: 6,
  },
];

export const useShieldedAssets = (): ShieldedAssetDataType[] => {
  return [];
};
