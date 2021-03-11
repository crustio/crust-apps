// [object Object]
// SPDX-License-Identifier: Apache-2.0

import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';

import { useTranslation } from '@polkadot/apps/translate';
import SettlementItem from '@polkadot/apps-merchants/Settlements/settlementItem';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockNumber } from '@polkadot/types/interfaces';

enum Status {
  Settlementable= 'Settlementable',
}

export interface ISettlementItem {
  cid: string,
  expiredTime: number
  fileSize: number
  renewReward: number
  replicas: number
  settlementReward: number
  status: Status
}
export interface Props {
  settlementList: ISettlementItem[]
}
// cid: "QmdupR3YAC2maPSwB76xzpKBiqDF2jj5nEfTHvEkxZL6d9"
// expiredTime: 572658
// fileSize: 75428712
// renewReward: 0
// replicas: 8
// settlementReward: 14201620.335324073
// status: "Settlementable"
export interface IHeaderItem {name: string, width: number, label: string, sortable: boolean}
export const headersList: IHeaderItem[] = [{
  name: 'cid',
  width: 20,
  label: 'cid',
  sortable: false
}, {
  name: 'expiredTime',
  width: 15,
  label: 'expiredTime',
  sortable: true
}, {
  name: 'fileSize',
  width: 20,
  label: 'fileSize',
  sortable: true
}, {
  name: 'settlementReward',
  width: 10,
  label: 'settlementReward(CRU)',
  sortable: true
}, {
  name: 'renewReward',
  width: 10,
  label: 'renewReward(CRU)',
  sortable: true
}, {
  name: 'totalReward',
  width: 10,
  label: 'totalReward(CRU)',
  sortable: true
}, {
  name: 'action',
  width: 15,
  label: 'action',
  sortable: false
}];

interface ISorting {
  by: string
  asc: boolean
}

const SettlementList: React.FC<Props> = ({ settlementList }) => {
  const { t } = useTranslation();
  const { api } = useApi();
  const tableRef = useRef(null);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  const _bestNumber: string = bestNumber ? bestNumber?.toString() : '0';

  const [listSorting, setListSorting] = useState<ISorting>({
    by: 'cid',
    asc: false
  });
  const [sortedList, setSortedList] = useState<ISettlementItem[]>(settlementList);

  const changeSort = (headerItem: IHeaderItem) => {
    const { name } = headerItem;

    if (name === listSorting.by) {
      setListSorting({
        by: name,
        asc: !listSorting.asc
      });
    } else {
      setListSorting({
        by: name,
        asc: !listSorting.asc
      });
    }

    const _list = _.orderBy(sortedList, [listSorting.by], [listSorting.asc ? 'asc' : 'desc']);

    setSortedList(_list);
    tableRef.current.forceUpdateGrid();
  };

  const sortByIcon = (order: string) => {
    if (listSorting.by === order) {
      return <span style={{ color: '#ff8812', fontSize: 18, fontWeight: 700 }}>{listSorting.asc ? ' ↑' : ' ↓'}</span>;
    }

    return null;
  };

  return <div>
    <header className='gray pv3 flex items-center flex-none'
      style={{ paddingRight: '1px', paddingLeft: '1px' }}>
      {headersList.map((item) => (
        <div className={`ph2 pv1 flex-auto db-l  w-${item.width} watch-list-header tc`}
          key={item.name}>
          <button
            onClick={() => {
              if (item.name === 'note') {
                return;
              }

              changeSort(item);
            }}
          >
            {t(`${item.label}`)}{sortByIcon(item.name)}
          </button>
        </div>
      ))}
    </header>
    <WindowScroller>
      {({ height, isScrolling }: {height: number, isScrolling: boolean }) => (
        <div className='flex-auto'>
          <AutoSizer disableHeight>
            {({ width }: {width: number}) => (
              <List
                aria-label={t('filesListLabel')}
                autoHeight
                className='outline-0'
                data={settlementList /* NOTE: this is a placebo prop to force the list to re-render */}
                height={height}
                isScrolling={isScrolling}
                ref={tableRef}
                rowCount={settlementList.length}
                rowHeight={50}
                rowRenderer={({ index, key }: {index: number, key: string}) => {
                  return <SettlementItem bestNumber={_bestNumber}
                    settlementItem={settlementList[index]}/>;
                }}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </WindowScroller>
  </div>;
};

export default SettlementList;
