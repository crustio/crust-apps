// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import { appsLogos } from '@polkadot/apps-config';

export default function create (t: TFunction): Route {
  return {
    Component: () => null,
    href: 'https://switchswap.io',
    display: {
      needsApi: []
    },
    group: 'applications',
    name: 'switchswap',
    logo: appsLogos.switchSwap,
    text: t('SwitchSwap', 'SwitchSwap', { ns: 'apps-routing' })
  };
}
