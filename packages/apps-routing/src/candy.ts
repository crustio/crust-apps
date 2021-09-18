// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/apps-candy/';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.candy.exchangeCandy'
      ]
    },
    group: 'accounts',
    icon: 'candy-cane',
    name: 'candy',
    text: t('nav.candy', 'Candy Exchange', { ns: 'apps-routing' })
  };
}
