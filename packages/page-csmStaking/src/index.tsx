// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';

import { useTranslation } from '@polkadot/apps/translate';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { SummaryInfo } from './Overview/Summary';
import Actions from './Actions';
import { httpGet } from './Overview/http';
import Overview from './Overview';
import { DataProviderState } from './Overview/types';
import lodash from 'lodash';

const Capacity_Unit = new BN(1024 * 1024);

interface OverviewInfo {
  providers: DataProviderState[];
  summaryInfo: SummaryInfo | null;
}

const getOverviewInfo = async (era: number): Promise<OverviewInfo> => {
  return await httpGet('https://pd-api.crust.network/overview/' + era).then((res) => {
    if (res.code == 200) {
      return {
        providers: lodash.filter(res?.statusText.providers, e => e.storage),
        summaryInfo: {
          calculatedRewards: res?.statusText.calculatedRewards,
          totalEffectiveStakes: res?.statusText.totalEffectiveStakes,
          dataPower: Capacity_Unit.mul(new BN(Number(res?.statusText.dataPower)))
        }
      }
    } else {
      return {
        providers: [],
        summaryInfo: null
      }
    }
  }).catch(() => {
    return {
      providers: [],
      summaryInfo: null
    }
  });
}

function CsmStakingApp({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);
  const [providers, setProviders] = useState<DataProviderState[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo | null>();
  const [isLoading, setIsloading] = useState<boolean>(true);

  const fetch = () => {
    const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
    if (activeEra) {
      const lastEra = activeEra - 1;
      getOverviewInfo(lastEra).then(res => {
        setProviders(res.providers)
        setSummaryInfo(res.summaryInfo)
        setIsloading(false);
      }).catch(() => setIsloading(true))
    }
  }

  useEffect(() => {
    setTimeout(fetch, 1000 * 6 * 6)
  }, [activeEraInfo]);

  useEffect(() => {
    api.query.staking.activeEra().then(
      res => {
        const activeEra = res && (JSON.parse(JSON.stringify(res)).index);
        const lastEra = activeEra - 1;
        getOverviewInfo(lastEra).then(res => {
          setProviders(res.providers)
          setSummaryInfo(res.summaryInfo)
          setIsloading(false);
        }).catch(() => setIsloading(true))
      }
    )
  }, [httpGet]);

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
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/actions`}>
          <Actions providers={providers?.map((e) => e.account)} />
        </Route>
        <Route basePath={basePath}
          onStatusChange={onStatusChange}>
          <Overview isLoading={isLoading}
            providers={providers}
            summaryInfo={summaryInfo} />
        </Route>

      </Switch>
    </main>
  );
}

export default React.memo(CsmStakingApp);
