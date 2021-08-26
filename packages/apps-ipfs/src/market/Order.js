// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import './index.css';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import OrderModal from '../files/modals/order-modal';
import PoolModal from '../files/modals/pool-modal/PoolModal';
import FetchModal from '../files/modals/fetch-modal/FetchModal';
import OrderList from './OrderList';
import WatchListInput from './WatchListInput';
import FileSaver from 'file-saver';
import _ from 'lodash';
import StatusContext from '../../../react-components/src/Status/Context';
import { fetchInfoByAccount } from '@polkadot/apps-ipfs/helpers/fetch';
import { Spinner, Dropdown } from '../../../react-components/src';
import { createAuthIpfsEndpoints } from '@polkadot/apps-config';
import UpFiles from '@polkadot/apps-ipfs/files/modals/up-files/UpFiles';
import { useMemo } from 'react/index';
import styled from 'styled-components';

const MDropdown = styled(Dropdown)`
  .ui--Dropdown {
    width: 23rem;
  }
`

const Order = ({ routeInfo: { url }, watchList, doAddOrders }) => {
  const isStorageFiles = url === '/storage_files';
  const [modalShow, toggleModal] = useState(false);
  const [showUpFiles, setShowUpFiles] = useState(false);
  const [upFile, setUpFile] = useState(null);
  const [tableData, setTableData] = useState(watchList);
  const [title, setTitle] = useState('order');
  const [fileInfo, setFileInfo] = useState(null);
  const [filterCid, setFilterCid] = useState(undefined)
  const { queueAction } = useContext(StatusContext);
  const [repaidModal, togglerepaidModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchModalShow, toggleFetchModalShow] = useState(false)

  const inputFile = useRef()
  const {t} = useTranslation('order')
  const endpoints = useMemo(
    () => createAuthIpfsEndpoints(t).map(item => ({...item, text: `${item.text}(${item.location})`})),
    [t]
  )
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoints[0]);
  const _onImportResult = useCallback(
    (message, status = 'queued') => {
      queueAction && queueAction({
        action: t('importInfo'),
        message,
        status
      });
    },
    [queueAction, t]
  );
  useEffect(() => {
    if (!filterCid) {
      setTableData(watchList);
    } else {
      const target = watchList.find((item) => item.fileCid === filterCid);

      target && setTableData([target]);
    }
  }, [watchList, filterCid]);

  const handleFilterWatchList = (fileCid) => {
    setFilterCid(fileCid)
  };
  const handleAddPool = (item) => {
    // add pool
    setFileInfo({ cid: item.fileCid, originalSize: item.fileSize, comment: item.comment, prepaid: item.prepaid });
    togglerepaidModal(true)
  }
  const handleFileChange = (e) => {
    try {
      setLoading(true)
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      if(!(/(.json)$/i.test(e.target.value))) {
        return _onImportResult(t('importResult.error1'), 'error')
      }
      fileReader.onload = e => {
        const _list = JSON.parse(e.target.result)
        if (!Array.isArray(_list)) {
          return _onImportResult(t('importResult.error2'), 'error')
        }
        // doAddItemMulti
        doAddOrders(_list).then(status =>{
          _onImportResult(t('importResult.success') + status.succeed + ',  ' + t('importResult.failed') + status.invalid + ',  ' + t('importResult.duplicated') + status.duplicated)
        })
        setLoading(false)
      }
    } catch(e) {
      setLoading(false)

    }
  }

  const handleToggleBtn = (type, item) => {
    // renew, retry, speed.
    setTitle(type);
    setFileInfo({ cid: item.fileCid, originalSize: item.fileSize, comment: item.comment });
    toggleModal(true);
  };
  const emitFetchModal = () => {
    toggleFetchModalShow(true)
  }

  const handleFetch = (accountId) => {
    toggleFetchModalShow(false)
    setLoading(true)
    fetchInfoByAccount(accountId).then(res =>{
      if (res.message === 'success') {
        let _orders = res.data ? res.data.orderedFiles : []
        const _list =  _orders.map((item) => ({fileCid:item}))
        doAddOrders(_list).then(status =>{
          _onImportResult(t('importResult.success') + status.succeed + ',  ' + t('importResult.failed') + status.invalid + ',  ' + t('importResult.duplicated') + status.duplicated)
        })
      }
    }).catch(() => {

    }).finally(() => {
      setLoading(false)
    })
  };



  const handleExport = () =>{
    const _list = watchList.map(_item => ({fileCid: _item.fileCid, comment: _item.comment}))
    const blob = new Blob([JSON.stringify(_list)], { type: 'application/json; charset=utf-8' });
    FileSaver.saveAs(blob, `watchList.json`);
  };

  const onInputFile = (e) => {
    if (!e.target.files || e.target.files.length === 0 || !e.target.files[0])
      return
    const file = e.target.files[0]
    e.target.value = ''
    setUpFile(file)
    setShowUpFiles(true)
  }
  return (
    <div className={'w-100'}>
      {
        repaidModal && <PoolModal onClose={() => {
          setFileInfo(null);
          togglerepaidModal(false);
        }} file={fileInfo}/>
      }
      {
        fetchModalShow &&
        <FetchModal onClose={() => {
          toggleFetchModalShow(false)
        }} onConfirm={handleFetch}
        />
      }
      {
        modalShow && <OrderModal
          file={fileInfo}
          onChange={() => {
            console.log('change');
          }}
          onClose={() => {
            setTitle('order');
            setFileInfo(null);
            toggleModal(false);
          }}
          title={title}/>}
      {
        upFile && showUpFiles && <UpFiles
          onClose={() => {
            setShowUpFiles(false)
            setUpFile(null)
          }}
          onSuccess={(res) => {
            setShowUpFiles(false)
            setFileInfo({ isForce: true, cid: res.Hash, originalSize: res.Size });
            toggleModal(true)
          }}
          file={upFile}
          endpoint={currentEndpoint} />
      }
      <div className={'w-100 btn-wrapper flex-l'}>
        { isStorageFiles ?
          <div className={'flex-l'} style={{ alignItems: 'center' }}>
            <input
              type={'file'}
              style={{ display: 'none' }}
              ref={inputFile}
              onChange={onInputFile} />
            <button className='btn' style={{ height: '2rem' }} onClick={() => {
              const event = new MouseEvent('click')
              inputFile?.current?.dispatchEvent(event)
            }}>{t('actions.upFiles')}</button>
            <MDropdown
              help={t('File streaming and wallet authentication will be processed by the chosen gateway') + t('Period')}
              label={t('Select a gateway')}
              options={endpoints}
              value={currentEndpoint.value}
              onChange={(value) => {
                setCurrentEndpoint(endpoints.find(item => item.value === value))
              }}
            />
            {/*<DropdownSelect {...forSelectEndpoints} head={t('selectEndpoint')} options={endpoints}/>*/}
          </div>
          :
          <button className='btn' onClick={() => toggleModal(true)}>{t('actions.addOrder')}</button>
        }
        <div style={{marginLeft: 'auto'}}>
            <input type="file" id="upload" size="60" onClick={(e) => {
              e.target.value = null
            }} style={{opacity:0, position: 'absolute', zIndex:-1}} onChange={handleFileChange} />
            <label className="btn" htmlFor="upload" style={{cursor: 'pointer'}}>
              {t('importBtn')}
            </label>
            &nbsp;&nbsp;
            <button className='btn' onClick={_.throttle(() => {
              handleExport()
            }, 2000)
            }>{t('exportBtn')}</button>
            &nbsp;&nbsp;
            <button className='btn' onClick={_.throttle(() => {
              emitFetchModal()
            }, 2000)
            }>{t('Fetch', 'Fetch')}</button>
        </div>
      </div>
      <div className={'orderList-header'}>
        <span className={'dib'}>{t('orderListdesc')}</span>
      </div>
      <WatchListInput
        onFilterWatchList={handleFilterWatchList}
      />
      {loading ? <Spinner label={t('Loading')} />
        : <OrderList onAddPool={handleAddPool} onToggleBtn={handleToggleBtn}
          watchList={tableData}/>
        }
    </div>
  );
};

export default connect(
  'selectRouteInfo',
  'doAddOrder',
  'doAddOrders',
  'selectWatchList',
  'selectWatchedCidList',
  'doNotifyFilesError',
  withTranslation('order')(Order)
);
