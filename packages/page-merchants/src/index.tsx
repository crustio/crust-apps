// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useIpfs } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import MainnetMarchants from './MainnetMarchants';
import MainnetSettlements from './MainnetSettlements';
import Merchants from './Merchants';
import Settlements from './Settlements';

const HIDDEN_ACC = ['vanity'];

function MerchantsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('My merchants')
    },
    {
      name: 'settlements',
      text: t<string>('Order settlement')
    }
  ]);

  return (
    <main className='accounts--App'>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/settlements`}>
          { isMaxwell ? <Settlements/> : <MainnetSettlements /> }
        </Route>
        <Route basePath={basePath}
          onStatusChange={onStatusChange}>
          { isMaxwell ? <Merchants/> : <MainnetMarchants /> }
        </Route>

      </Switch>
    </main>
  );
}

export default React.memo(MerchantsApp);
