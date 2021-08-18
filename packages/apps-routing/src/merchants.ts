// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/apps-merchants/routes/merchants';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'storage',
    icon: 'users',
    name: 'merchants',
    text: t('nav.merchants', 'Storage merchant', { ns: 'apps-routing' })
  };
}
