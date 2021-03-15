// [object Object]
// SPDX-License-Identifier: Apache-2.0

import './index.css';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import SettleModal from '@polkadot/apps-merchants/Settlements/settle-modal/SettleModal';
import SettlementItem from '@polkadot/apps-merchants/Settlements/settlementItem';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockNumber } from '@polkadot/types/interfaces';

enum EStatus {
  Settlementable = 'Settlementable',
  Renewable = 'Renewable'
}

export interface ISettlementItem {
  cid: string;
  expiredTime: number;
  fileSize: number;
  renewReward: number;
  replicas: number;
  settlementReward: number;
  status: EStatus;
  totalReward?: number;
}

export interface IHeaderItem {
  name: string;
  width: number;
  label: string;
  sortable: boolean;
}
export const headersList: IHeaderItem[] = [
  {
    name: 'cid',
    width: 20,
    label: 'File Cid',
    sortable: false
  },
  {
    name: 'fileSize',
    width: 10,
    label: 'File Size',
    sortable: true
  },
  {
    name: 'expiredTime',
    width: 15,
    label: 'Expired On(block/date)',
    sortable: true
  },
  {
    name: 'settlementReward',
    width: 15,
    label: 'Settlement Commission',
    sortable: true
  },
  {
    name: 'renewReward',
    width: 15,
    label: 'Renewal Commission',
    sortable: true
  },
  {
    name: 'totalReward',
    width: 15,
    label: 'Total Commission',
    sortable: true
  },
  {
    name: 'action',
    width: 10,
    label: 'Action',
    sortable: false
  }
];

interface ISorting {
  by: string;
  asc: boolean;
}
export interface Props {
  settlementList: ISettlementItem[];
}

const SettlementList: React.FC<Props> = ({ settlementList }) => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [settleDialog, toggleSettleDialog] = useState(false);
  const [fileCid, setFileCid] = useState('');
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  const _bestNumber: string = bestNumber ? bestNumber?.toString() : '0';

  const [listSorting, setListSorting] = useState<ISorting>({
    by: 'expiredTime',
    asc: false
  });
  const [sortedList, setSortedList] = useState<ISettlementItem[]>([]);

  useEffect(() => {
    setSortedList(settlementList);
  }, [settlementList]);

  const handleSettle = (fileCid: string) => {
    toggleSettleDialog(true);
    setFileCid(fileCid);
  };

  const onCloseSettle = () => {
    toggleSettleDialog(false);
    setFileCid('');
  };

  const onSettleSuccess = () => {
    _.remove(sortedList, (item) => item.cid === fileCid);
    setSortedList(sortedList);
  };

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
        asc: false
      });
    }
  };

  const sortByIcon = (order: string) => {
    if (listSorting.by === order) {
      return <span style={{ color: '#ff8812', fontSize: 18, fontWeight: 700 }}>{listSorting.asc ? ' ↓' : ' ↑'}</span>;
    }

    return null;
  };

  return (

    <>
      {settleDialog && <SettleModal fileCid={fileCid}
        onClose={onCloseSettle}
        onSuccess={onSettleSuccess} />}
      <div className={'FilesList no-select sans-serif border-box w-100 flex flex-column'}>
        <header className='gray pv3 flex items-center flex-none'
          style={{ paddingRight: '1px', paddingLeft: '1px' }}>
          {headersList.map((item) => (
            <div className={`ph2 pv1 flex-auto db-l  w-${item.width} watch-list-header tc`}
              key={item.name}>
              <button
                onClick={() => {
                  item.sortable && changeSort(item);
                }}
              >
                {t(`${item.label}`)}
                {item.sortable && sortByIcon(item.name)}
              </button>
            </div>
          ))}
        </header>
        {/* TODO: to use react-virtualized */}
        {
          sortedList.length > 0
            ? sortedList.map((item) => {
              return <SettlementItem
                bestNumber={_bestNumber}
                handleSettle={handleSettle}
                key={item.cid}
                settlementItem={item}
              />;
            })
            : <div className={'nodata'}/>
        }
      </div></>
  );
};

export default SettlementList;
