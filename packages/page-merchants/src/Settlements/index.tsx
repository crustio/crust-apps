// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { ISettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';
import { Button, Spinner } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import Pagination from '@material-ui/lab/Pagination';

import FetchModal from './fetch-modal/FetchModal';
import { fetchFileTobeClaimed } from './fetch';
import Settlement from './Settlement';
import SettlementList from './settlementList';
import { BlockAuthorsContext } from '@polkadot/react-query';
import _ from "lodash";

const ROW = 100;

const Settlements: React.FC = () => {
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
  const [ expiredStatus, setExpiredStatus ] = useState<number | null>(null);
  const [ address, setAddress ] = useState<string[]>([]);
  // const [ totalOrderCount, setTotalOrderCount ] = useState<number>(0);
  const [ totalPageCount, setTotalPageCount ] = useState<number>(0);
  const [ pageIndex, setPageIndex ] = useState<number>(1);
  
  const { lastBlockNumber } = useContext(BlockAuthorsContext);

  const fetchData = () => {
    toggleLoading(true);
    fetchFileTobeClaimed({ row: ROW, page: pageIndex -1, expired_status: expiredStatus as number, address }, {
      filePrice: Number(fileByteFee.toString()), 
      currentBn: Number(lastBlockNumber), 
      renewRewardRatio: Number(renewRewardRatio) / 100000000000, 
      fileDuration: Number(fileDuration), 
      baseFee: Number(fileBaseFee)
    }).then((res: any) => {
      (res.list as ISettlementItem[]).forEach((item: ISettlementItem) => {
        item.totalReward = item.settlementReward + item.renewReward;
      });
      setSettlements(res.list as ISettlementItem[]);
      // setTotalOrderCount(res.total);
      setTotalPageCount(Math.floor(_.divide(res.total, ROW)) + 1);

    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      // setSettlements([]);
      toggleLoading(false);
    });
  };

  useEffect(() => {
    if (fileByteFee && fileBaseFee && fileDuration && renewRewardRatio) {
      fetchData()
    }
  }, [pageIndex])

  const data = useCallback(() => {
    fetchData()
  }, [fileByteFee, fileBaseFee, fileDuration, renewRewardRatio, expiredStatus, address, pageIndex])

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
        onClose={() => {
          toggleFetchModalShow();
        }}
        onConfirm={() => {
          data();
          toggleFetchModalShow();
        }}
        onChangeExpiredStatus={setExpiredStatus}
        onChangeAddress={setAddress}
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
          
        <Pagination count={totalPageCount} page={pageIndex} color="standard"  onChange={(_: object, page: number) => {
          setPageIndex(page)
        }} ></Pagination >
        </div>

        <SettlementList
          settlementList={filterList}/></div>
    }

  </div>;
};

export default Settlements;
