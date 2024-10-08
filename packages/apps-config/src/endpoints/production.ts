// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { expandEndpoints } from './util';

export const mainnetEndPoints = [
  'wss://crust.api.onfinality.io/ws?apikey=04dc9514-ec6c-4293-a739-aad78f8b26b5',
  'wss://rpc.crust.network',
  'wss://rpc-crust-mainnet.decoo.io',
  'wss://api.decloudf.com',
  'wss://rpc.crustnetwork.xyz'
];

export const maxwellEndPoints = [
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
        OnFinality: 'wss://crust.api.onfinality.io/ws?apikey=04dc9514-ec6c-4293-a739-aad78f8b26b5',
        'Crust Network 1': 'wss://rpc.crust.network',
        'Crust Network 2': 'wss://rpc.crustnetwork.xyz',
        'Crust Network 3': 'wss://rpc.crustnetwork.cc',
        'Crust Network 4': 'wss://rpc.crustnetwork.app',
        'DCloud Foundation': 'wss://rpc-crust-mainnet.decoo.io',
      }
    },
    // {
    //   info: 'crust-maxwell',
    //   text: t('rpc.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
    //   providers: {
    //     'Crust Network': maxwellEndPoints[0],
    //     'Decoo Technologies': maxwellEndPoints[1]
    //     // Pinknode: maxwellEndPoints[2]
    //   }
    // },
    {
      info: 'shadow',
      text: t('rpc.crust.network', 'Crust Shadow', { ns: 'apps-config' }),
      providers: {
        'Crust Network 1': 'wss://rpc-sha-subscan.crust.network',
        'Crust Network 2': 'wss://rpc-sha-subscan.crustnetwork.xyz',
        'Crust Network 3': 'wss://rpc-sha-subscan.crustnetwork.cc',
        'Crust Network 4': 'wss://rpc-sha-subscan.crustnetwork.app',
        'via Crust APP': 'wss://rpc-shadow.crustnetwork.app',
        'via Crust CC': 'wss://rpc-shadow.crustnetwork.cc',
        'via Crust XYZ': 'wss://rpc-shadow.crustnetwork.xyz'
      }
    },
    {
      info: 'crustParachain',
      text: t('rpc.crust.network', 'Crust Parachain', { ns: 'apps-config' }),
      providers: {
        'Crust Network 1': 'wss://crust-parachain.crustapps.net',
        'Crust Network 2': 'wss://crust-parachain.crustnetwork.xyz',
        'Crust Network 3': 'wss://crust-parachain.crustnetwork.cc',
        'Crust Network 4': 'wss://crust-parachain.crustnetwork.app',
      }
    }
  ]);
}
