// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import VersionQuery from './versionQuery';
import basicMd from './md/basic.md';
import basicMd_zh from './md/basic_zh.md';
import Summary from './SummaryInfo';
import { BlockAuthorsContext } from '@polkadot/react-query';

const HIDDEN_ACC = ['vanity'];

function getSum (total: string, num: string) {
  return total + num;
}

const getNumber = (str: string) => {
  return Number(str.split(',').reduce(getSum));
};

function BridgeApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t, i18n } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { lastBlockNumber } = useContext(BlockAuthorsContext);
  const [current, setCurrent] = useState<number>(0);

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'sworkerVersion',
      text: t<string>('sWorker Version')
    }
  ]);

  useEffect(() => {
    if (lastBlockNumber) {
      setCurrent(getNumber(lastBlockNumber))
    }

  }, [lastBlockNumber])

  return (
    
        <main className='accounts--App'>
          <header>
            <Tabs
              basePath={basePath}
              hidden={(hasAccounts) ? undefined : HIDDEN_ACC}
              items={itemsRef.current}
            />
          </header>
          <HelpOverlay md={i18n.language == 'zh' ? basicMd_zh as string : basicMd as string} />
          <Summary current={current} />
          <Switch>
            <Route basePath={basePath}
              onStatusChange={onStatusChange}>
                <VersionQuery current={current} />
            </Route>
          </Switch>
        </main>

  );
}

export default React.memo(BridgeApp);
