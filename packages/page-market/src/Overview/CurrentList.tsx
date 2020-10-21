// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MerchantSortBy, MerchantSortInfo } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  toggleFavorite: (address: string) => void;
  merchants: string[];
  merchantSortInfo: MerchantSortInfo[];
}

interface SortState {
  sortBy: MerchantSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankNumNominators: 'media--1200'
};

function sort (sortBy: MerchantSortBy, sortFromMax: boolean, merchants: MerchantSortInfo[]): number[] {
  return [...Array(merchants.length).keys()]
    .sort((a, b) =>
      sortFromMax
        ? merchants[a][sortBy] - merchants[b][sortBy]
        : merchants[b][sortBy] - merchants[a][sortBy]
    )
    .sort((a, b) =>
      merchants[a].isFavorite === merchants[b].isFavorite
        ? 0
        : (merchants[a].isFavorite ? -1 : 1)
    );
}

function CurrentList ({ favorites, toggleFavorite, merchantSortInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [withIdentity, setWithIdentity] = useState(false);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'rankCapacity', sortFromMax: true });
  const [sorted, setSorted] = useState<number[] | undefined>();

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  useEffect((): void => {
    merchantSortInfo && setSorted(sort(sortBy, sortFromMax, merchantSortInfo));
  }, [sortBy, sortFromMax, merchantSortInfo]);

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

  return <Table
          empty={!isLoading && merchantSortInfo && t<string>('No active merchants found')}
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
          {/* {isLoading ? undefined : _renderRows(filterMerchantInfos)} */}

          {merchantSortInfo && sorted && (merchantSortInfo.length === sorted.length) && sorted.map((index): React.ReactNode =>
            <Address
              address={merchantSortInfo[index].accountId}
              filterName={nameFilter}
              isFavorite={merchantSortInfo[index].isFavorite}
              key={merchantSortInfo[index].accountId}
              toggleFavorite={toggleFavorite}
              // validatorInfo={infoMap[address]}
              withIdentity={withIdentity}
            />
        )}
        </Table>

}

export default React.memo(CurrentList);
