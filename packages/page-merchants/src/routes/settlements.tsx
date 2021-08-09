// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import basicMd from '../md/basic.md';
import Settlements from '../Settlements';

const HIDDEN_ACC = ['vanity'];

function MerchantsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { hasAccounts } = useAccounts();
    const { isIpfs } = useIpfs();

    const itemsRef = useRef([
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
      <Route path={`${basePath}`}>
          <Settlements/>
        </Route>
    </main>
    );
}

export default React.memo(MerchantsApp);
