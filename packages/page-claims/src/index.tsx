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
import ClaimsMainnet from './claimsMainnet';
import CSMClaims from './maxwellCsmClaims';

function ClaimsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([{
    isRoot: true,
    name: 'claims',
    text: t<string>('Claim CRU')
  }, 
  // {
  //   name: 'claimsMainnet',
  //   text: t<string>('Claim CRU18')
  // },
   {
    name: 'maxwellCsmClaims',
    text: t<string>('Claim CSM')
  }]);

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/claimsMainnet`}>
          <ClaimsMainnet />
        </Route>
        <Route path={`${basePath}/maxwellCsmClaims`}>
          <CSMClaims />
        </Route>
        <Route basePath={basePath}
            onStatusChange={onStatusChange}>
          <Claims />
        </Route>
      </Switch>
      
    </main>
  );
}

export default React.memo(ClaimsApp);
