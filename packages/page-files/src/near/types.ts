// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyPair, WalletConnection } from 'near-api-js';

export interface NearM {
  isLoad: boolean,
  wallet?: WalletConnection,
  keyPair?: KeyPair,
}
