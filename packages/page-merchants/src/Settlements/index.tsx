// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { ISettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';
import { Button, Spinner } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import FetchModal from './fetch-modal/FetchModal';
import { fetchFileTobeClaimed } from './fetch';
import Settlement from './Settlement';
import SettlementList from './settlementList';

const Settlements: React.FC = () => {
  const { t } = useTranslation();
  const [settlements, setSettlements] = useState<ISettlementItem[]>([]);
  const [fetchModalShow, toggleFetchModalShow] = useToggle(false);
  const [isSettlementOpen, toggleSettlement] = useToggle(false);
  const [loading, toggleLoading] = useState(false);
  const [fileCid, setFileCid] = useState('');
  const [filterList, setFilterList] = useState<ISettlementItem[]>([]);

  const fetchData = () => {
    toggleLoading(true);
    fetchFileTobeClaimed().then((res) => {
      (res as ISettlementItem[]).forEach((item: ISettlementItem) => {
        item.totalReward = item.settlementReward + item.renewReward;
      });
      setSettlements(res as ISettlementItem[]);
    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      toggleLoading(false);
    });
  };

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
      fetchModalShow && <FetchModal onClose={() => {
        toggleFetchModalShow();
      }}
      onConfirm={() => {
        fetchData();
        toggleFetchModalShow();
      }}/>
    }

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
        </div>
        <SettlementList
          settlementList={filterList}/></div>
    }

  </div>;
};

export default Settlements;
