// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useEthers } from './useEthers';
import { useWeb3 } from './useWeb3';

export const useEtherAccounts = (): { data?: string[] } => {
  const { provider } = useEthers();
  const { accounts: web3Accounts } = useWeb3();

  const [accounts, setAccounts] = useState<string[]>();

  useEffect(() => {
    // NOTE: speaks only the accounts available from Ethers to stay consist
    provider?.listAccounts().then((accounts) => {
      setAccounts(accounts);
    });
  }, [provider, web3Accounts]);

  // NOTE: there were some legacy shits, so keep accounts in `data` field
  return { data: accounts };
};
