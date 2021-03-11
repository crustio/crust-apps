// [object Object]
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import filesize from 'filesize';
import React, { useMemo } from 'react/index';

import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import CopyButton from '@polkadot/apps-ipfs/components/copy-button';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';
import { headersList, ISettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';
import { formatBalance } from '@polkadot/util';

interface Props {
  settlementItem:ISettlementItem
  bestNumber: string
}

const SettlementItem:React.FC<Props> = ({ bestNumber, settlementItem }) => {
  const { cid, expiredTime, fileSize, renewReward, settlementReward } = settlementItem;

  const calculateExpiredTime = useMemo(() => {
    const durations = (settlementItem.expiredTime - Number(bestNumber)) * 6;

    return dayjs().add(durations, 'seconds').format('YYYY-MM-DD');
  }, [settlementItem, bestNumber]);

  const formatNum = (num: any) => {
    return formatBalance(num, { decimals: 12, withSi: true });
  };

  return <div className={'File b--light-gray relative  flex items-center bt'}>
    {
      headersList.map((item) => {
        return <div className={`relative tc justify-center flex items-center  ph2 pv1 w-${item.width}`}>
          {
            item.name === 'cid' &&
            <Cid value={settlementItem.cid} />
          }
          {
            item.name === 'expiredTime' &&
            <span>{calculateExpiredTime } / {settlementItem.expiredTime}</span>
          }
          {
            item.name === 'fileSize' &&
            <span>{fileSize ? filesize(fileSize, { round: 2 }) : '-'}</span>
          }
          {
            item.name === 'renewReward' &&
            <span>{formatNum(settlementReward)}</span>
          }
          {
            item.name === 'settlementReward' &&
            <span>{formatNum(settlementReward)}</span>
          }
          {
            item.name === 'allReward' &&
            <span>allReward</span>
          }
          {
            item.name === 'action' &&
            <span>Action</span>
          }

        </div>;
      })
    }
  </div>;
};

export default SettlementItem;
