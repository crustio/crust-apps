// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { connect, keyStores, WalletConnection } from 'near-api-js';
import { NearConfig } from 'near-api-js/lib/near';
import { useEffect, useState } from 'react';

import { nearConfig } from './config';
import { NearM } from './types';

export function useNear (): NearM {
  const [near, setNear] = useState<NearM>({ isLoad: true });

  useEffect(() => {
    // eslint-disable-next-line no-void
    void (async function () {
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      const config: NearConfig = { ...nearConfig, deps: { keyStore } };
      const nearObj = await connect(config);
      const walletAccount = new WalletConnection(nearObj, null);

      try {
        if (walletAccount.isSignedIn()) {
          const keyPair = await keyStore.getKey(config.networkId, walletAccount.getAccountId());

          setNear({ isLoad: false, wallet: walletAccount, keyPair });
        } else {
          setNear({ isLoad: false, wallet: walletAccount });
        }
      } catch (e) {
        setNear({ isLoad: false, wallet: walletAccount });
      }
    })();
  }, []);

  return near;
}
