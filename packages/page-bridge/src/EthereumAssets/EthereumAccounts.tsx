// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

interface Option {
  text: string;
  value: string;
}

export function createAccountsOpt (accounts: string[]): Option[] {
  return accounts.map((addr) => {
    return { text: addr, value: addr };
  });
}
