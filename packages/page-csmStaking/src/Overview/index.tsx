// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Summary, { SummaryInfo } from './Summary';
import { Icon, Spinner, Table } from '@polkadot/react-components';
import { useApi, useCall, useFavorites, useSavedFlags } from '@polkadot/react-hooks';
import Filtering from '@polkadot/app-staking/Filtering';
import DataProvider from './DataProvider';
import { DataProviderState, ProviderSortBy } from './types';
import lodash from 'lodash';
import BoosterCountDown from './BoosterCountDown';
import { ActiveEraInfo } from '@polkadot/types/interfaces';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  providers: DataProviderState[];
  isLoading: boolean;
  summaryInfo: SummaryInfo
}

const CSM_FAVS = 'csmStaking:favorites';
interface SortState {
  sortBy: ProviderSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankBondOwn: 'media--900'
};

function applyFilter(providers: DataProviderState[]): DataProviderState[] {
  return providers;
}

const sortProviders = (providers: DataProviderState[], favorites: string[]): DataProviderState[] => {
  lodash.map(providers, (provider) => {
    provider.isFavorite = favorites.includes(provider.account)
  })
  return lodash.sortBy(providers, e => e.isFavorite)
}

function sort(sortBy: ProviderSortBy, sortFromMax: boolean, providers: DataProviderState[]): DataProviderState[] {
  return providers
    .sort((a, b) => sortFromMax
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
    )
    .sort((a, b) => a.isFavorite === b.isFavorite
      ? 0
      : (a.isFavorite ? -1 : 1)
    );
}

const SORT_KEYS = ['storage', 'csmLimit', 'effectiveCSM', 'stakedCSM', 'guaranteeFee'];

function Overview({ providers, isLoading, summaryInfo }: Props): React.ReactElement<Props> {
  const { t, i18n } = useTranslation();
  const { api } = useApi();
  // we have a very large list, so we use a loading delay
  // const [nameFilter, setNameFilter] = useState<string>('');
  const [, setProviders] = useState<DataProviderState[]>([]);
  const [toggles, setToggle] = useSavedFlags('csmStaking:overview', { withIdentity: false });
  const [favorites, toggleFavorite] = useFavorites(CSM_FAVS);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'storage', sortFromMax: false });
  const [sorted, setSorted] = useState<DataProviderState[] | undefined>();
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState({ isQueryFiltered: false, nameFilter: '' });
  const endTime = Date.parse('2021-07-11 14:00');
  const [remaining, setRemaing] = useState<number>(endTime - new Date().getTime());
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);

  const labelsRef = useRef({
    storage: t<string>('data power'),
    csmLimit: t<string>('CSM stake limit'),
    effectiveCSM: t<string>('effective stakes'),
    stakedCSM: t<string>('total stakes'),
    guaranteeFee: t<string>('guarantee fee')
  });

  useEffect(() => {
    // let now_time = new Date().getTime();
    // var remaining = endTime - now_time;
    const timer = setInterval(() => {
        if (remaining > 1000) {
          setRemaing(remaining-1000)
        } else {
          clearInterval(timer)
        }
    }, 1000)
}, [activeEra]);

  const filtered = useMemo(
    () => providers && applyFilter(providers),
    [providers]
  );

  useEffect((): void => {
    const sortedProviders = sortProviders(providers, favorites);
    setProviders(sortedProviders)

  }, [providers, favorites]);

  const _sort = useCallback(
    (newSortBy: ProviderSortBy) => setSortBy(({ sortBy, sortFromMax }) => ({
      sortBy: newSortBy,
      sortFromMax: newSortBy === sortBy
        ? !sortFromMax
        : true
    })),
    []
  );

  useEffect((): void => {
    filtered && setSorted(
      sort(sortBy, sortFromMax, filtered)
    );
  }, [filtered, sortBy, sortFromMax]);

  const _renderRows = useCallback(
    (addresses?: DataProviderState[]): React.ReactNode[] =>
      (addresses || []).map((info): React.ReactNode => (
        <DataProvider
          key={info.account}
          info={info}
          filterName={nameFilter}
          withIdentity={toggles.withIdentity}
          toggleFavorite={toggleFavorite}
          isFavorite={info.isFavorite}
        />
      )),
    [nameFilter, setToggle, toggles, toggleFavorite]
  );

  const _setNameFilter = useCallback(
    (nameFilter: string, isQueryFiltered: boolean) => setNameFilter({ isQueryFiltered, nameFilter }),
    []
  );

  const header = useMemo(() => [
    [t('providers'), 'start', 2],
    ...(SORT_KEYS as (keyof typeof labelsRef.current)[]).map((header) => [
      <>{labelsRef.current[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
      `${sorted ? `isClickable ${sortBy === header ? 'highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
      1,
      () => _sort(header as 'storage')
    ]),

  ], [_sort, labelsRef, sortBy, sorted, sortFromMax, t])

  const filter = useMemo(() => (
    <Filtering
      nameFilter={nameFilter}
      setNameFilter={_setNameFilter}
      setWithIdentity={setToggle.withIdentity}
      withIdentity={toggles.withIdentity}
    >
    </Filtering>

  ), [nameFilter, _setNameFilter, setToggle, t, toggles]);

  const displayList = isQueryFiltered
    ? providers
    : sorted;

  return (<>
      <h3 style={{ "textAlign": 'center' }}>
        <span style={{ "wordWrap": "break-word", "wordBreak": "break-all", float: "left", 'display': 'inline-block' }}><span style={{ 'fontWeight': 'bold', fontSize: '16px' }}>
          <a href={i18n.language == 'zh' ? 'https://mp.weixin.qq.com/s/vLnuyU5gJCRcOSv_PrLAsw' : 'https://medium.com/crustnetwork/profit-data-activity-rules-3ef2c9b364c4'} target="_blank">
            {t<string>(`Learn more about "Profit Data" >>`)}</a>
        </span>
        </span>
        {remaining > 1000 ? (<section style={{'display': 'inline-block', "wordWrap": "break-word", "wordBreak": "break-all"}}>
          <span style={{"marginRight": "5px", 'fontWeight': 'bold', fontSize: '16px'}}><a href={i18n.language == 'zh' ? 'https://mp.weixin.qq.com/s/P3kCjhPNg9UUH8eLXpvvZg' : 'https://crustnetwork.medium.com/10x-for-10-days-data-power-boost-is-launched-fd6e05b44115'} target="_blank">{t<string>('Data Power Booster 🔥 >>')}</a></span>
          <BoosterCountDown />
        </section>) : null}
        <span style={{ "wordWrap": "break-word", "wordBreak": "break-all", float: "right", 'display': 'inline-block' }}><span style={{ 'fontWeight': 'bold', fontSize: '16px' }}>
          <a href={i18n.language == 'zh' ? 'https://mp.weixin.qq.com/s/pp74MQMODwID_gkrbMdHug' : 'https://medium.com/crustnetwork/profit-data-data-power-rules-adjustments-and-upgrades-9fa406c6fc34'} target="_blank">
            {t<string>(`About "Data Power" >>`)}</a>
        </span>
        </span>
      </h3>
      {isLoading ? <Spinner noLabel /> : <Summary isLoading={isLoading} info={summaryInfo} />}
    <Table
      empty={!isLoading && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
      header={header}
      filter={filter}
    >
      {isLoading ? undefined : _renderRows(displayList)}
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
