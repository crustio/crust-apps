// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ActiveEraInfo } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import promotional from '../images/promotional.png';
import Summary, { SummaryInfo } from './Summary';
import { Table } from '@polkadot/react-components';
import { useApi, useCall, useSavedFlags } from '@polkadot/react-hooks';
import Filtering from '@polkadot/app-staking/Filtering';
import DataProvider from './DataProvider';
import { DataProviderState } from './types';
import { httpGet } from '../http';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

function Overview({ }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  // we have a very large list, so we use a loading delay
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('csmStaking:overview', { withIdentity: false });
  const [providers, setProviders] = useState<DataProviderState[]>([]);
  const [ summaryInfo, setSummaryInfo ] = useState<SummaryInfo | null>();
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);
  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
  
  useEffect(() => {
    if (activeEra) {
      const lastEra = activeEra - 1;
      httpGet('http://crust-sg1.ownstack.cn:8866/overview/' + lastEra).then(res => {
        setProviders(res?.statusText.providers)
        setSummaryInfo({
          calculatedRewards: res?.statusText.calculatedRewards,
          totalEffectiveStakes: res?.statusText.totalEffectiveStakes,
          dataPower: Number(res?.statusText.dataPower * 1024) 
        })
        setIsloading(false)
      }).catch(() => setIsloading(true))
    }
  //   httpPost('http://crust-sg1.ownstack.cn:8866/accounts', {
  //     accounts: ["5EJPtyWs9M3vEVGjcyjTMeGQEsnowwouZAUnFVUmdjJyPpBM", "5F9BYd21i2p6UL4j4CGZ6kFEBqnzyBuH6Tw6rGxhZsVg3e3q"]
  // }).then((res: any) => {
  //     console.log('res', res)
  //   })
  }, [api, activeEra])

  const headerRef = useRef([
    [t('providers'), 'address'],
    [t('data size'), 'number'],
    [t('CSM limit'), 'number'],
    [t('effective stakes'), 'number'],
    [t('total stakes'), 'number'],
    [t('guarantee fee'), 'number']
  ]);

  const _renderRows = useCallback(
    (addresses?: DataProviderState[]): React.ReactNode[] =>
      (addresses || []).map((info): React.ReactNode => (
        <DataProvider
          info={info}
          filterName={nameFilter}
          withIdentity={toggles.withIdentity}
        />
      )),
    [nameFilter, toggles]
  );

  return (<>
    <img src={promotional as string} style={{ "marginRight": "auto", 'textAlign': 'center', 'display': 'block' }}></img>
    <Summary info={summaryInfo} />
    <Table
      empty={!isLoading && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
      header={headerRef.current}
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          setWithIdentity={setToggle.withIdentity}
          withIdentity={toggles.withIdentity}
        />
      }
    >
      {isLoading ? undefined : _renderRows(providers)}
    </Table>
  </>
  );
}

export default React.memo(styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
