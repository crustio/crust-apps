// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtensionProvider } from '@elrondnetwork/erdjs';
import { useEffect, useState } from 'react';

import { ElrondM } from './types';

export function useElrond (): ElrondM {
  const [elornd, setElornd] = useState<ElrondM>({ isInstalled: false, isLoad: true });

  useEffect(() => {
    // eslint-disable-next-line
    const provider = ExtensionProvider.getInstance();

    provider
      .init()
      .then((initialised) => {
        if (initialised) {
          setElornd({ isInstalled: true, isLoad: false, provider });
        } else {
          console.warn(
            'Something went wrong trying to redirect to wallet login..'
          );
          setElornd({ isInstalled: false, isLoad: false });
        }
      })
      .catch((err) => {
        console.warn(err);
        setElornd({ isInstalled: false, isLoad: false });
      });
  }, []);

  return elornd;
}
