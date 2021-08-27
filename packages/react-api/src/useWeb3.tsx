// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';

interface Props {
  children: React.ReactNode;
}

interface Provider {
  readonly _: unique symbol
  on?(
    eventName: 'accountsChanged',
    handler: (accounts?: string[]) => void
  ): void
  on?(eventName: 'chainChanged', handler: () => void): void
  on?(eventName: 'connect', handler: (info: { chainId: number }) => void): void
}

export type Readystate = 'idle' | 'connecting' | 'connected' | 'unavailable'

interface IWeb3Context {
  /**
     * Injected accounts notified by `accountsChanged`
     */
  accounts: string[]
  provider?: Provider
  readystate: Readystate
}

const Web3Context = createContext<IWeb3Context>({ accounts: [], readystate: 'idle' });

function Web3Provider ({ children }: Props): React.ReactElement<Props> | null {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [provider, setProvider] = useState<Provider>();
  const [readystate, setReadystate] = useState<Readystate>('idle');

  const web3Modal = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new Web3Modal({
          cacheProvider: true,
          providerOptions: {}
        })
        : {
          connect: () => {
            throw new Error('web3modal is unavailable in SSR');
          }
        },
    []
  );

  useEffect(() => {
    if (readystate !== 'idle') {
      return;
    }

    setAccounts([]);
    setReadystate('connecting');
    web3Modal
      .connect()
      .then((provider) => {
        setReadystate('connected');
        setProvider(provider as Provider);
      })
      .catch(() => {
        setReadystate('unavailable');
      });
  }, [readystate, web3Modal]);

  useEffect(() => {
    provider?.on?.('accountsChanged', (accounts) => {
      setAccounts(accounts ?? []);
    });
    provider?.on?.('chainChanged', () => {
      setProvider(undefined);
      setReadystate('idle');
    });
    provider?.on?.('connect', (info: { chainId: number }) => {
      console.log(info);
    });
  }, [provider]);

  return (
    <Web3Context.Provider value={{ accounts, provider, readystate }}>
      {children}
    </Web3Context.Provider>
  );
}

export default React.memo(Web3Provider);

export const useWeb3 = (): IWeb3Context => useContext(Web3Context);
