// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import Pagination from '@material-ui/lab/Pagination';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { ISettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';
import { Button, Spinner } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import FetchModal from './fetch-modal/FetchModal';
import { fetchFileTobeClaimed, FileStatus } from './fetch';
import Settlement from './Settlement';
import SettlementList from './settlementList';

const ROW = 100;

function getSum (total: string, num: string) {
  return total + num;
}

const getNumber = (str: string) => {
  return str.split(',').reduce(getSum);
};

const MainnetSettlements: React.FC = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [settlements, setSettlements] = useState<ISettlementItem[]>([]);
  const [fetchModalShow, toggleFetchModalShow] = useToggle(false);
  const [isSettlementOpen, toggleSettlement] = useToggle(false);
  const [loading, toggleLoading] = useState(false);
  const [fileCid, setFileCid] = useState('');
  const [filterList, setFilterList] = useState<ISettlementItem[]>([]);
  const fileByteFee = useCall<any>(api.query.market.fileByteFee);
  const fileBaseFee = useCall<any>(api.query.market.fileBaseFee);
  const fileDuration = api.consts.market.fileDuration;
  const renewRewardRatio = api.consts.market.renewRewardRatio;
  const [expiredStatus, setExpiredStatus] = useState<FileStatus>({ valid: false, expiredWithin15Days: false, expired15Days: false });
  const [address, setAddress] = useState<string[]>([]);
  // const [ totalOrderCount, setTotalOrderCount ] = useState<number>(0);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const { lastBlockNumber } = useContext(BlockAuthorsContext);

  const fetchData = () => {
    const byteFee = fileByteFee && JSON.parse(JSON.stringify(fileByteFee));
    const baseFee = fileByteFee && JSON.parse(JSON.stringify(fileBaseFee));
    const duration = fileByteFee && JSON.parse(JSON.stringify(fileDuration));
    const rewardRatio = fileByteFee && JSON.parse(JSON.stringify(renewRewardRatio));

    if (byteFee && baseFee && duration && rewardRatio && lastBlockNumber) {
      toggleLoading(true);

      fetchFileTobeClaimed({ row: ROW, page: pageIndex - 1, address }, {
        filePrice: Number(fileByteFee.toString()),
        currentBn: Number(getNumber(lastBlockNumber)),
        renewRewardRatio: Number(renewRewardRatio) / 1000000000000,
        fileDuration: Number(fileDuration),
        baseFee: Number(fileBaseFee)
      }, expiredStatus).then((res: any) => {
        (res.list as ISettlementItem[]).forEach((item: ISettlementItem) => {
          item.totalReward = item.settlementReward + item.renewReward;
        });
        setTotalPageCount(Math.floor(_.divide(res.total, ROW)) + 1);
        setSettlements(res.list as ISettlementItem[]);
        // setTotalOrderCount(res.total);
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        // setSettlements([]);
        toggleLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex]);

  const data = useCallback(() => {
    fetchData();
  }, [fileByteFee, fileBaseFee, fileDuration, renewRewardRatio, expiredStatus, address, pageIndex]);

  useEffect(() => {
    if (!fileCid) {
      setFilterList(settlements);
    } else {
      const target = settlements.find((item) => item.cid === fileCid);

      target ? setFilterList([target]) : setFilterList([]);
    }
  }, [settlements, fileCid]);

  return <div className={'w-100'}
    style={{ background: '#fff' }}>
    {
      fetchModalShow && <FetchModal
        onChangeAddress={setAddress}
        onChangeExpiredStatus={setExpiredStatus}
        onClose={() => {
          toggleFetchModalShow();
        }}
        onConfirm={() => {
          data();
          toggleFetchModalShow();
        }}
      />}

    {loading
      ? <Spinner label={t<string>('Loading')} />
      : <div>
        {isSettlementOpen && <Settlement onClose={toggleSettlement} />
        }
        <section style={{ display: 'inline-block' }}>
          <Button.Group>
            <Button
              icon='download'
              label={t<string>('Fetch')}
              onClick={toggleFetchModalShow}
            />
            <Button
              icon='unlock'
              label={t<string>('Settle')}
              onClick={toggleSettlement}
            />
          </Button.Group>
        </section>
        {/* <div className='btn-wrapper'>
          <span className={'btn pointer'}
            onClick={() => {
              toggleFetchModalShow(true);
            }}>{t('Fetch')}</span>
        </div> */}
        <div className={'add-watch-list-wrapper'}>
          <input aria-describedby='ipfs-path-desc'
            className={'input-reset bn pa2 dib w-30 f6 br-0 placeholder-light'}
            id='ipfs-path'
            onChange={(e) => {
              setFileCid(e.target.value);
            }}
            placeholder='file CID'
            style={{ borderRadius: '3px 0 0 3px' }}
            type='text'
            value={fileCid} />

          <Pagination color='standard'
            count={totalPageCount}
            onChange={(_: object, page: number) => {
              setPageIndex(page);
            }}
            page={pageIndex}
            siblingCount={1} ></Pagination >
        </div>

        <SettlementList
          settlementList={filterList}/></div>
    }

  </div>;
};

export default MainnetSettlements;
