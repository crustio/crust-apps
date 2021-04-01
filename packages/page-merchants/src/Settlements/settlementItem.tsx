// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import filesize from 'filesize';
import React, { useMemo } from 'react/index';

import { useTranslation } from '@polkadot/apps/translate';
import Cid from '@polkadot/apps-ipfs/components/cid/Cid';
import CopyButton from '@polkadot/apps-ipfs/components/copy-button';
import StrokeCopy from '@polkadot/apps-ipfs/icons/StrokeCopy';
import { formatBalance } from '@polkadot/util';

import { headersList, ISettlementItem } from './settlementList';

interface Props {
  settlementItem: ISettlementItem
  bestNumber: string,
  handleSettle: (fileCid: string) => void
}

const SettlementItem: React.FC<Props> = ({ bestNumber, handleSettle, settlementItem }) => {
  const { cid, expiredTime, fileSize, renewReward, settlementReward, totalReward } = settlementItem;
  const { t } = useTranslation();

  const calculateExpiredTime = useMemo(() => {
    const durations = (expiredTime - Number(bestNumber)) * 6;

    return dayjs().add(durations, 'seconds').format('YYYY-MM-DD');
  }, [expiredTime, bestNumber]);

  const formatNum = (num: any) => {
    return formatBalance(num, { decimals: 12, withSi: true });
  };

  return <div className={'File b--light-gray relative  flex items-center bt'}
    style={{ height: 50 }}>
    {
      headersList.map((item) => <div className={`relative tc justify-center flex items-center  ph2 pv1 w-${item.width}`}
        key={item.name}>
        {
          item.name === 'cid' &&
            <>
              <Cid style={{ display: 'inline' }}
                title={cid}
                value={cid} />
              <CopyButton message={t('fileCidCopied')}
                text={cid}>
                <StrokeCopy className='fill-aqua pointer'
                  style={{ width: 18 }} />
              </CopyButton>
            </>

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
          <span>{formatNum(renewReward)}</span>
        }
        {
          item.name === 'settlementReward' &&
          <span>{formatNum(settlementReward)}</span>
        }
        {
          item.name === 'totalReward' &&
          <span>{formatNum(totalReward)}</span>
        }
        {
          item.name === 'action' &&
          <span className={'btn pointer'}
            onClick={() => {
              handleSettle(settlementItem.cid);
            }}>{t('Settle', 'Settle')}</span>
        }
      </div>)
    }
  </div>;
};

export default SettlementItem;
