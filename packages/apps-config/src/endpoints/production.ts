// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

export * from './productionRelayKusama';
export * from './productionRelayPolkadot';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodChains: EndpointOption[] = [
  {
    info: 'crust',
    text: 'Crust Network',
    providers: {
      'Crust Network': 'wss://crust-main.crust.network',
      OnFinality: 'wss://crust-main.api.onfinality.io/public-ws',
      'DCloud Foundation': 'wss://crust-main.dcf.network/public-ws',
    }
  },
  {
    info: 'shadow',
    text: 'Crust Shadow',
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
    text: 'Crust Parachain',
    providers: {
      'Crust Network': 'wss://crust-parachain.crustapps.net'
    }
  }
];
