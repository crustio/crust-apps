// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/apps-merchants/';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.market.addCollateral',
        'tx.market.cutCollateral'
      ]
    },
    group: 'network',
    icon: 'users',
    name: 'market',
    text: t('nav.market', 'Market', { ns: 'apps-routing' })
  };
}
