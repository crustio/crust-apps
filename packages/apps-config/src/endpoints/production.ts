// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { expandEndpoints } from './util';

export const endPoints = [
  'wss://api-maxwell.crust.network',
  'wss://rpc-crust.decoo.io',
  'wss://rpc.pinknode.io/maxwell/aaa-bbb'
];

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createProduction (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    {
      info: 'crust',
      text: t('rpc.crust.network', 'Crust', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://rpc.crust.network',
        'Decoo Technologies': 'wss://rpc-crust-mainnet.decoo.io',
        'DCloud Foundation': 'wss://api.decloudf.com'
      }
    },
    {
      info: 'crust-maxwell',
      text: t('rpc.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': endPoints[0],
        'Decoo Technologies': endPoints[1],
        Pinknode: endPoints[2]
      }
    }
  ]);
}
