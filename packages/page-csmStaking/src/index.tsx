// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { Tabs } from '@polkadot/react-components';
import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import Actions from './Actions';
import Overview from './Overview';

const HIDDEN_ACC = ['vanity'];

function CsmStakingApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'actions',
      text: t<string>('Account actions')
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
        <Route path={`${basePath}/actions`}>
          <Actions/>
        </Route>
        <Route basePath={basePath}
          onStatusChange={onStatusChange}>
          <Overview/>
        </Route>

      </Switch>
    </main>
  );
}

export default React.memo(CsmStakingApp);
