// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { SolanaM } from './types';

export function useSolana (): SolanaM {
  const [solana, setSolana] = useState<SolanaM>({ isInstalled: false, isLoad: true });

  useEffect(() => {
    // eslint-disable-next-line
    const isInstalled = window.solana && window.solana.isPhantom;

    if (!isInstalled) {
      setSolana({ isInstalled: false, isLoad: false });

      return;
    }

    setSolana({ isInstalled: true, isLoad: false });
  }, []);

  return solana;
}
