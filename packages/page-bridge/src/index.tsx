// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useIpfs } from '@polkadot/react-hooks';

const HIDDEN_ACC = ['vanity'];

function BridgeApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const itemsRef = useRef([
      {
        isRoot: true,
        name: 'bridge',
        text: t<string>('Crust to Parachain')
      },
      {
        name: 'bridgeBack',
        text: t<string>('Parachain to Crust')
      }
    ]);

  return (
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
            </Route>
            <Route basePath={basePath}
              onStatusChange={onStatusChange}>
            </Route>

          </Switch>
        </main>
    );
}

export default React.memo(BridgeApp);