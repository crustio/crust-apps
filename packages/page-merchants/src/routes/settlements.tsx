// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useIpfs } from '@polkadot/react-hooks';

import MainnetSettlements from '../MainnetSettlements';
import basicMd from '../md/basic.md';
import Settlements from '../Settlements';

const HIDDEN_ACC = ['vanity'];

const themeDict: { [k: string]: string } = {
  Crust: 'mainnet',
  'Crust Maxwell': 'maxwell',
  'Crust Rockey': 'rockey'
};

function MerchantsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';
  const theme = themeDict[systemChain] || 'rockey';

  const itemsRef = useRef([
    {
      name: 'settlements',
      text: t<string>('Order settlement')
    }
  ]);

  return (
    <main className={`accounts--App ${theme}`}>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
          items={itemsRef.current}
        />
      </header>
      <Route path={`${basePath}`}>
        { isMaxwell ? <Settlements/> : <MainnetSettlements /> }
      </Route>
    </main>
  );
}

export default React.memo(MerchantsApp);
