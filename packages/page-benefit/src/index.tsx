// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { Tabs } from '@polkadot/react-components';
import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import StorageMarket from './StorageMarket';
import WorkReport from './WorkReport';

const HIDDEN_ACC = ['vanity'];

function BenifitApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'reportWworks',
      text: t<string>('Work report')
    },
    {
      name: 'storageMarket',
      text: t<string>('Storage')
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
        <Route path={`${basePath}/storageMarket`}>
          <StorageMarket />
        </Route>
        <Route basePath={basePath}
          onStatusChange={onStatusChange}>
          <WorkReport />
        </Route>

      </Switch>
    </main>
  );
}

export default React.memo(BenifitApp);
