// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-csmStaking';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
      ]
    },
    group: 'csmStaking',
    icon: '500px',
    name: 'csmStaking',
    text: t('nav.csmStaking', 'Profit Data', { ns: 'apps-routing' })
  };
}
