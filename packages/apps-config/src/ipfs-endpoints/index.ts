// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { AuthIpfsEndpoint } from './types';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createAuthIpfsEndpoints (t: TFunction): AuthIpfsEndpoint[] {
  return [
    {
      value: 'https://crustwebsites.net', // https://ipfs-auth.decoo.io
      text: t('Crust Network'),
      location: t('Singapore')
    },
    {
      value: 'https://ipfs-auth.decoo.io', // https://ipfs-auth.decoo.io
      text: t('Decoo.io'),
      location: t('United States')
    }
  ];
}
