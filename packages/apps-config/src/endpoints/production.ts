// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// alphabetical based on chain name
export function createProduction (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    {
      info: 'crust',
      text: t('rpc.prod.crust', 'Crust Network', { ns: 'apps-config' }),
      providers: {
        OnFinality: 'wss://crust-main-onFinality.crust.network',
        'Crust Network': 'wss://crust-main.crust.network',
        'Decoo Technologies': 'wss://crust-main-decoo.crust.network',
        'DCloud Foundation': 'wss://crust-main-dcf.crust.network'
      }
    },
    {
      info: 'crust-maxwell',
      text: t('rpc.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://crust-maxwell.crust.network',
        'Decoo Technologies': 'wss://crust-maxwell-decoo.crust.network',
        Pinknode: 'wss://crust-maxwell-pinknode.crust.network'
      }
    },
    {
      info: 'shadow',
      text: t('rpc.crust.network', 'Crust Shadow', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://rpc2-shadow.crust.network'
      }
    }
  ], firstOnly, withSort);
}
