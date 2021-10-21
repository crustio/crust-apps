// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';

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
import { ApiPromise } from '@polkadot/api';
import { BN_ZERO } from '@polkadot/util';
import EasterEggsOrders from './EasterEggsOrders';
import { ActiveEraInfo } from '@polkadot/types/interfaces';

export const Capacity_Unit = new BN(1024 * 1024);

interface OverviewInfo {
  providers: DataProviderState[];
  summaryInfo: SummaryInfo | null;
}

interface ProviderInfo {
  account: string;
  storage: number;
  guarantors: string[];
  guaranteeFee: number;
}

async function transformProviderStateInfo(api: ApiPromise, provider: ProviderInfo, factor: number): Promise<DataProviderState> {
  const multiQuery = await api.query.csmLocking.ledger.multi(provider.guarantors.concat(provider.account))
  const tmp = multiQuery && JSON.parse(JSON.stringify(multiQuery))
  let total = BN_ZERO;

  if (tmp && tmp.length) {
      for (const ledger of tmp) {
          total = total.add(new BN(Number(ledger.active).toString()))
      }
  }
  const csmLimit = provider.storage * 0.01 * factor;
  const stakedCSM = total.div(new BN(1e6)).toNumber()/1_000_000;
  const effectiveCSM = Math.min(csmLimit, stakedCSM);

  return {
    account: provider.account,
    csmLimit,
    effectiveCSM,
    stakedCSM,
    storage: provider.storage,
    guaranteeFee: provider.guaranteeFee,
    isFavorite: false
  }
}

const getOverviewInfo = async (overviewUrl: string, api: ApiPromise, factor: number): Promise<OverviewInfo> => {
  return await httpGet(overviewUrl).then(async (res: { code: number; statusText: { providers: any; calculatedRewards: any; totalProviders: any; totalGuarantors: any; dataPower: any; }; }) => {
    if (res.code == 200) {
      const filered = lodash.filter(res?.statusText.providers, e => e.storage)
      const providers = [];
      let totalEffectiveStakes = 0;
      for (const provider of filered) {
        const providerState = await transformProviderStateInfo(api, provider, factor);
        totalEffectiveStakes += providerState.effectiveCSM;
        providers.push(providerState);
      }
      return {
        providers: providers,
        summaryInfo: {
          calculatedRewards: res?.statusText.calculatedRewards,
          totalEffectiveStakes,
          totalProviders: res?.statusText.totalProviders,
          totalGuarantors: res?.statusText.totalGuarantors,
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
  const { api, systemChain } = useApi();
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);
  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
  const increasingFactor =  Math.pow(1.02, 80) * Math.pow(1.03, Math.min(activeEra-1224, 40));
  const overviewUrl = systemChain == 'Crust Maxwell' ? 'https://pd-api.crust.network/overview/' : 'http://crust-sg1.ownstack.cn:8866/overview/';
  const [providers, setProviders] = useState<DataProviderState[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo | null>();
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    if (Number(increasingFactor)) {
      getOverviewInfo(overviewUrl, api, increasingFactor).then(res => {
        setProviders(res.providers)
        setSummaryInfo(res.summaryInfo)
        setIsloading(false);
      }).catch(() => setIsloading(true))
    }
  }, [api, httpGet, overviewUrl, increasingFactor]);

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'actions',
      text: t<string>('Account actions')
    },
    {
      name: 'easterEggsOrders',
      text: t<string>('Lucky Orders')
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
        <Route path={`${basePath}/easterEggsOrders`}>
          <EasterEggsOrders />
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
