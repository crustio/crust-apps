// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface MetamaskReqOptions {
  from?: string,
  params?: string[]
  method: string,
}

export interface Metamask {
  isInstalled: boolean,
  ethereum?: {
    isMetaMask: boolean,
    request: <T>(option: MetamaskReqOptions) => Promise<T>,
    selectedAddress?: string,
  },
  isLoad: boolean,
  isAllowed: boolean,
  accounts: string[],
}
