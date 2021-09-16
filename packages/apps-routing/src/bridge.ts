// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/apps-bridge/';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.bridgeTransfer.transferNative'
      ]
    },
    group: 'accounts',
    icon: 'exchange-alt',
    name: 'bridge',
    text: t('nav.bridge', 'Bridge', { ns: 'apps-routing' })
  };
}
