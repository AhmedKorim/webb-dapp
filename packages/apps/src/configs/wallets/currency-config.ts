import EdgwareLogo from '@webb-dapp/apps/configs/wallets/logos/EdgwareLogo';
import EtherLogo from '@webb-dapp/apps/configs/wallets/logos/Eth';
import { AppConfig } from '@webb-dapp/react-environment';
import React from 'react';
import { WebbCurrencyId } from '@webb-dapp/apps/configs/wallets/webb-currency-id.enum';

export const currenciesConfig: AppConfig['currencies'] = {
  [WebbCurrencyId.EDG]: {
    name: 'Edgware token',
    symbol: 'EDG',
    color: '',
    id: WebbCurrencyId.EDG,
    icon: React.createElement(EdgwareLogo),
  },
  [WebbCurrencyId.TEDG]: {
    name: 'Edgware test token',
    symbol: 'tEDG',
    color: '',
    id: 2,
    icon: React.createElement(EdgwareLogo),
  },
  [WebbCurrencyId.ETH]: {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '',
    id: WebbCurrencyId.ETH,
    icon: React.createElement(EtherLogo),
  },
};
