// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component from '@polkadot/app-market';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        ['tx.market.register']
      ]
    },
    group: 'network',
    icon: 'users',
    name: 'market',
    text: t<string>('nav.market', 'StorageMarket', { ns: 'apps-routing' })
  };
}
