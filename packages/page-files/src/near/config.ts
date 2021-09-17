// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NearConfig } from 'near-api-js/lib/near';

export interface WrapNearConfig extends NearConfig {
  contractName: string,
}

export const nearConfig: WrapNearConfig = {
  // test
  // networkId: 'testnet',
  // contractName: 'eericxu.testnet',
  // nodeUrl: 'https://rpc.testnet.near.org',
  // walletUrl: 'https://wallet.testnet.near.org',
  // helperUrl: 'https://helper.testnet.near.org'
  // prod
  networkId: 'mainet',
  contractName: 'crust.near',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.near.org',
  helperUrl: 'https://helper.mainnet.near.org'
};
