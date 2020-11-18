// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';
import Component from './ipfsPage';

export default function create (t: <T = string>(key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {},
    icon: 'cogs',
    name: 'storage',
    group: 'storage',
    text: t<string>('nav.ipfs', 'Storage', { ns: 'apps-routing' })
  };
}
// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0