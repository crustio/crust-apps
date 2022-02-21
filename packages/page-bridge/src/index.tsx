// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { EthersProvider, Web3Provider } from '@polkadot/react-api';
import { Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useIpfs } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import ElrondAssets from './ElrondAssets';
import EthereumAssets from './EthereumAssets';
import MainnetAssets from './MainnetAssets';
import ShadowAssets from './ShadowAssets';

const HIDDEN_ACC = ['vanity'];

function BridgeApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const itemsRef = isFunction(api.tx.bridgeTransfer?.transferToElrond)
    ? useRef([
      {
        isRoot: true,
        name: 'bridge',
        text: t<string>('Crust to Ethereum')
      },
      {
        name: 'bridgeBack',
        text: t<string>('Ethereum to Crust')
      },
      {
        name: 'bridgeToElrond',
        text: t<string>('Crust to Elrond')
      }
    ])
    : useRef([
      {
        isRoot: true,
        name: 'bridge',
        text: t<string>('Crust to Ethereum')
      },
      {
        name: 'bridgeBack',
        text: t<string>('Ethereum to Crust')
      },
      {
        name: 'bridgeToShadow',
        text: t<string>('Maxwell to Shadow')
      }
    ]);

  return (
    <Web3Provider>
      <EthersProvider>
        <main className='accounts--App'>
          <header>
            <Tabs
              basePath={basePath}
              hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
              items={itemsRef.current}
            />
          </header>
          <Switch>
            <Route path={`${basePath}/bridgeBack`}>
              <EthereumAssets />
            </Route>
            {isFunction(api.tx.bridgeTransfer?.transferToElrond) && <Route path={`${basePath}/bridgeToElrond`}>
              <ElrondAssets />
            </Route>}
            {isFunction(api.tx.csm?.forceTransfer) && <Route path={`${basePath}/bridgeToShadow`}>
              <ShadowAssets />
            </Route>}
            <Route basePath={basePath}
              onStatusChange={onStatusChange}>
              <MainnetAssets />
            </Route>

          </Switch>
        </main>
      </EthersProvider>

    </Web3Provider>
  );
}

export default React.memo(BridgeApp);
