// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component: () => null,
    href: 'https://crustfiles.io',
    display: {
      needsApi: []
    },
    group: 'applications',
    icon: 'file',
    name: 'files',
    text: t('Files', 'Files', { ns: 'apps-routing' })
  };
}
