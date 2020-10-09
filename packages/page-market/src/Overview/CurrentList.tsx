// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Authors } from '@polkadot/react-query/BlockAuthors';
import { MerchantSortBy, MerchantSortInfo, SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  next?: string[];
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  merchants: string[];
  merchantSortInfo: MerchantSortInfo[];
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  elected?: AccountExtend[];
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
  filterMerchants?: AccountExtend[];
  filterMerchantInfos?: AccountExtend[];
}

interface SortState {
  sortBy: MerchantSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankNumNominators: 'media--1200'
};

const EmptyAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor: {}, eraPoints: {}, lastBlockAuthors: [], lastHeaders: [] });

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([,, isFavA]: AccountExtend, [,, isFavB]: AccountExtend): number =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function sort (sortBy: MerchantSortBy, sortFromMax: boolean, merchants: MerchantSortInfo[]): number[] {
  return [...Array(merchants.length).keys()]
    .sort((a, b) =>
      sortFromMax
        ? merchants[a][sortBy] - merchants[b][sortBy]
        : merchants[b][sortBy] - merchants[a][sortBy]
    )
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

function getFiltered (stakingOverview: DeriveStakingOverview, favorites: string[], next?: string[], merchants?: string[], merchantSortInfo?: MerchantSortInfo[]): Filtered {
  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);
  const validators = filterAccounts(validatorIds, allElected, favorites, []);
  const elected = filterAccounts(allElected, allElected, favorites, validatorIds);
  const waiting = filterAccounts(next, [], favorites, allElected);
  const filterMerchants = filterAccounts(merchants, allElected, favorites, []);
  const filterMerchantInfos = filterAccounts(merchantSortInfo && merchantSortInfo.map(e => e.accountId), allElected, favorites, []);

  return {
    elected,
    validators,
    waiting,
    filterMerchants,
    filterMerchantInfos
  };
}

function CurrentList ({ favorites, hasQueries, isIntentions, next, stakingOverview, targets, toggleFavorite, merchants, merchantSortInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const recentlyOnline = useCall<DeriveHeartbeats>(!isIntentions && api.derive.imOnline?.receivedHeartbeats);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [withIdentity, setWithIdentity] = useState(false);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'rankCapacity', sortFromMax: true });
  const [sorted, setSorted] = useState<number[] | undefined>();

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  useEffect((): void => {
    merchantSortInfo && setSorted(sort(sortBy, sortFromMax, merchantSortInfo));
  }, [sortBy, sortFromMax, merchantSortInfo]);

  const { validators, filterMerchantInfos } = useMemo(
    () => stakingOverview ? getFiltered(stakingOverview, favorites, next, merchants, merchantSortInfo) : {},
    [favorites, next, stakingOverview, merchants]
  );

  const infoMap = useMemo(
    () => (targets?.validators || []).reduce((result: Record<string, ValidatorInfo>, info): Record<string, ValidatorInfo> => {
      result[info.accountId.toString()] = info;

      return result;
    }, {}),
    [targets]
  );

  const _sort = useCallback(
    (newSortBy: MerchantSortBy) => setSortBy(({ sortBy, sortFromMax }) => ({
      sortBy: newSortBy,
      sortFromMax: newSortBy === sortBy
        ? !sortFromMax
        : true
    })),
    []
  );

  const labelsRef = useRef({
    rankCapacity: t<string>('total capacity'),
    rankPrice: t<string>('storage price'),
    rankOrderCount: t<string>('current order count')
  });

  // const headerActiveRef = useRef([
  //   [t('merchants'), 'start', 2],
  //   [t('total capacity'), 'media--1100'],
  //   [t('storage price')],
  //   [t('current order count')],
  //   [undefined, 'media--1200']
  // ]);

  const header = useMemo(() => [
    [t('merchants'), 'start', 2],
    ...(['rankCapacity', 'rankPrice', 'rankOrderCount'] as (keyof typeof labelsRef.current)[])
      .map((header) => [
        <>{labelsRef.current[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
        `${sorted ? `isClickable ${sortBy === header ? 'highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
        1,
        () => _sort(header as 'rankCapacity')
      ]),
    [undefined, 'media--1200']
  ], [_sort, labelsRef, sortBy, sorted, sortFromMax, t]);

  const _renderRows = useCallback(
    (addresses?: AccountExtend[]): React.ReactNode[] =>
      (addresses || []).map(([address,, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          isFavorite={isFavorite}
          key={address}
          toggleFavorite={toggleFavorite}
          validatorInfo={infoMap[address]}
          withIdentity={withIdentity}
        />
      )),
    [byAuthor, eraPoints, hasQueries, infoMap, nameFilter, recentlyOnline, toggleFavorite, withIdentity]
  );

  return <Table
          empty={!isLoading && validators && t<string>('No active validators found')}
          filter={
            <Filtering
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              setWithIdentity={setWithIdentity}
              withIdentity={withIdentity}
            />
          }
          header={header}
        >
          {isLoading ? undefined : _renderRows(filterMerchantInfos)}
        </Table>

}

export default React.memo(CurrentList);
