// Copyright 2017-2021 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useTranslation } from './translate';
// @ts-ignore
import { httpPost } from './http';
import { Route, Switch } from 'react-router-dom';

export { default as useCounter } from './useCounter';
import Claims from './claims';
import ClaimsCru18 from './claimsCru18';
import CSMClaims from './maxwellCsmClaims';
import { useApi } from '@polkadot/react-hooks';
import MaxwellClaims from './maxwellClaims';

function ClaimsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';

  const itemsRef = !isMaxwell ? useRef([{
    isRoot: true,
    name: 'claims',
    text: t<string>('Claim CRU')
  }]) : useRef([{
    isRoot: true,
    name: 'claims',
    text: t<string>('Claim CRU')
  }, 
  {
    name: 'claimsCru18',
    text: t<string>('Claim CRU18')
  },
   {
    name: 'maxwellCsmClaims',
    text: t<string>('Claim CSM')
  }]);

  return !isMaxwell ? (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route basePath={basePath}
            onStatusChange={onStatusChange}>
          <Claims />
        </Route>
      </Switch> 
    </main>
  ) : (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/claimsCru18`}>
          <ClaimsCru18 />
        </Route>
        <Route path={`${basePath}/maxwellCsmClaims`}>
          <CSMClaims />
        </Route>
        <Route basePath={basePath}
            onStatusChange={onStatusChange}>
          <MaxwellClaims />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ClaimsApp);
