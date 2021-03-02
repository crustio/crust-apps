// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Component from './ipfsPage';
import { Route } from './types';

export default function create (t: <T = string>(key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.market.placeStorageOrder',
        'query.market.files'
      ]
    },
    icon: 'ipfs',
    name: 'storage',
    group: 'storage',
    text: t<string>('nav.ipfs', 'IPFS', { ns: 'apps-routing' })
  };
}
