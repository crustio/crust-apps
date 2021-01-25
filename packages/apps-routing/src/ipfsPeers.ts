// Copyright 2017-2021 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Component from './ipfsPage';
import { Route } from './types';

export default function create (t: <T = string>(key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {},
    group: 'ipfs',
    icon: 'ipfs',
    name: 'storage/peers',
    text: t<string>('nav.peers', 'Peers', { ns: 'apps-routing' })
  };
}
// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0
