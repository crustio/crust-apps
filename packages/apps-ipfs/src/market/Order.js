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
import StatusContext from '../../../react-components/src/Status/Context';
import { fetchInfoByAccount } from '@polkadot/apps-ipfs/helpers/fetch';
import { DropdownWrap, Spinner } from '../../../react-components/src';
import { createAuthIpfsEndpoints } from '@polkadot/apps-config';
import UpFiles from '@polkadot/apps-ipfs/files/modals/up-files/UpFiles';
import { useMemo } from 'react/index';
import styled from 'styled-components';
import SelectUploadMode, { DevGuide } from '@polkadot/apps-ipfs/market/SelectUploadMode';
import { useApi } from '@polkadot/react-hooks';

const MDropdown = styled(DropdownWrap)`
  .menu {
    height: 20rem;
    max-height: unset;
    padding-bottom: 100px;

    .footer {
      position: absolute;
      top: calc(100% - 50px);
      height: 50px;
      color: #619BDE;
      font-size: 14px;
      text-align: center;
      width: 100%;
      line-height: 50px;
      cursor: pointer;
      border-top: solid 1px #EEEEEE;

      &:hover {
        color: #4a90e2;
      }
    }
  }
`;

function randomSort (a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

const MDevGuide = styled(DevGuide)`
  top: 0;
  right: 30px;
`;
const UP_MODES = [
  { text: 'Upload files by IPFS', value: 'ipfs' },
  { text: 'Upload files by Gateway', value: 'gateway' }
];
const Order = ({ routeInfo: { url, params }, watchList: list, doAddOrders }) => {
  const isWatchOne = params.cid && params.cid.startsWith('Qm')
  const watchList = isWatchOne ? [{ fileCid: params.cid }] : list
  const [uploadMode, setUploadMode] = useState({
    isLoad: true,
    mode: '',
  });
  const isShowSelectedMode = !uploadMode.mode;
  // const isIpfsMode = uploadMode.mode === 'ipfs';
  const isGatewayMode = uploadMode.mode === 'gateway';
  const doSetUploadMode = (mode) => {
    setUploadMode({ mode, isLoad: false });
    window.localStorage.setItem('uploadMode', mode);
    const hash = window.location.hash
    console.info('hash::', hash)
    if (!hash.startsWith('#/storage') || hash === '#/storage' || hash === '#/storage_files'){
      window.location.hash = mode === 'ipfs' ? '/storage' : '/storage_files';
    }
  };
  useEffect(() => {
    const mode = window.localStorage.getItem('uploadMode');
    if (mode) {
      doSetUploadMode(mode);
    } else {
      setUploadMode({ ...uploadMode, isLoad: false });
    }
  }, [url]);
  const { t } = useTranslation('order');
  const upModeOptions = UP_MODES.map(item => ({ ...item, text: t(item.text) }));
  const [modalShow, toggleModal] = useState(false);
  const [showUpFiles, setShowUpFiles] = useState(false);
  const [upFile, setUpFile] = useState(null);
  const [tableData, setTableData] = useState(watchList);
  const [title, setTitle] = useState('order');
  const [fileInfo, setFileInfo] = useState(null);
  const [filterCid, setFilterCid] = useState(undefined);
  const { queueAction } = useContext(StatusContext);
  const [repaidModal, togglerepaidModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchModalShow, toggleFetchModalShow] = useState(false);
  const { systemChain } = useApi();
  const disableGateway = systemChain === 'Crust Maxwell';
  const inputFile = useRef();
  const endpoints = useMemo(
    () => createAuthIpfsEndpoints(t).sort(randomSort).map(item => ({
      ...item,
      text: `${item.text}(${item.location})`
    })),
    [t]
  );
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoints[0]);
  const gateway = isGatewayMode ? currentEndpoint.value : 'https://ipfs.io';

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
  }, isWatchOne ? [filterCid] : [watchList, filterCid]);

  const handleFilterWatchList = (fileCid) => {
    setFilterCid(fileCid);
  };
  const handleAddPool = (item) => {
    // add pool
    setFileInfo({
      cid: item.fileCid,
      fileName: item.fileName,
      originalSize: item.fileSize,
      comment: item.comment,
      prepaid: item.prepaid
    });
    togglerepaidModal(true);
  };
  const handleFileChange = (e) => {
    try {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      if (!(/(.json)$/i.test(e.target.value))) {
        return _onImportResult(t('importResult.error1'), 'error');
      }
      fileReader.onload = e => {
        const _list = JSON.parse(e.target.result);
        if (!Array.isArray(_list)) {
          return _onImportResult(t('importResult.error2'), 'error');
        }
        // doAddItemMulti
        doAddOrders(_list).then(status => {
          _onImportResult(t('importResult.success') + status.succeed + ',  ' + t('importResult.failed') + status.invalid + ',  ' + t('importResult.duplicated') + status.duplicated);
        });
        setLoading(false);
      };
    } catch (e) {
      setLoading(false);

    }
  };

  const handleToggleBtn = (type, item) => {
    // renew, retry, speed.
    setTitle(type);
    setFileInfo({ cid: item.fileCid, fileName: item.fileName, originalSize: item.fileSize, comment: item.comment });
    toggleModal(true);
  };
  const emitFetchModal = () => {
    toggleFetchModalShow(true);
  };

  const handleFetch = (accountId) => {
    toggleFetchModalShow(false);
    setLoading(true);
    fetchInfoByAccount(accountId).then(res => {
      if (res.message === 'success') {
        let _orders = res.data ? res.data.orderedFiles : [];
        const _list = _orders.map((item) => ({ fileCid: item }));
        doAddOrders(_list).then(status => {
          _onImportResult(t('importResult.success') + status.succeed + ',  ' + t('importResult.failed') + status.invalid + ',  ' + t('importResult.duplicated') + status.duplicated);
        });
      }
    }).catch(() => {

    }).finally(() => {
      setLoading(false);
    });
  };

  const handleExport = () => {
    const _list = watchList.map(_item => ({
      fileCid: _item.fileCid,
      fileName: _item.fileName,
      comment: _item.comment
    }));
    const blob = new Blob([JSON.stringify(_list)], { type: 'application/json; charset=utf-8' });
    FileSaver.saveAs(blob, `watchList.json`);
  };

  const onInputFile = (e) => {
    if (!e.target.files || e.target.files.length === 0 || !e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    e.target.value = '';
    setUpFile(file);
    setShowUpFiles(true);
  };
  if (uploadMode.isLoad) {
    return <Spinner label={t('Loading')}/>;
  }
  if (isShowSelectedMode) {
    return <SelectUploadMode onClick={doSetUploadMode}/>;
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
          toggleFetchModalShow(false);
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
            setShowUpFiles(false);
            setUpFile(null);
          }}
          onSuccess={(res) => {
            setShowUpFiles(false);
            setFileInfo({ isForce: true, cid: res.Hash, fileName: res.Name, originalSize: res.Size });
            toggleModal(true);
          }}
          file={upFile}
          endpoint={currentEndpoint}/>
      }
      {!isWatchOne && <>
        <div className={'w-100 btn-wrapper flex-l'}>
          <div className={'flex-l'} style={{ alignItems: 'center', width: '32rem' }}>
            {
              isGatewayMode ?
                <input
                  type={'file'}
                  style={{ display: 'none' }}
                  ref={inputFile}
                  onChange={onInputFile}/>
                :
                <button
                  className='btn'
                  style={{ height: '3.7rem', padding: '8px 40px', }}
                  onClick={() => toggleModal(true)}>
                  {t('actions.addOrder')}
                </button>
            }
            {
              isGatewayMode && <>
                <button className={`btn ${disableGateway ? 'disabled' : ''}`}
                        disabled={disableGateway}
                        style={{ height: '3.7rem', padding: '8px 40px', }}
                        onClick={() => {
                          const event = new MouseEvent('click');
                          inputFile?.current?.dispatchEvent(event);
                        }}>{t('actions.upFiles')}</button>
                <MDropdown
                  className={'flex-grow-1'}
                  help={t('File streaming and wallet authentication will be processed by the chosen gateway') + t('Period')}
                  label={t('Select a gateway')}
                  options={endpoints}
                  value={currentEndpoint.value}
                  onChange={(value) => {
                    setCurrentEndpoint(endpoints.find(item => item.value === value));
                  }}
                  header={
                    <div className='footer'
                         onClick={() => window.open('https://github.com/crustio/crust-apps/tree/master/packages/apps-config/src/ipfs-gateway-endpoints', '_blank')}
                    >{t('Contribute to Web3 IPFS Gateway')}</div>
                  }
                />
              </>
            }
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <DropdownWrap
              options={upModeOptions}
              label={t('Switch Mode')}
              value={uploadMode.mode}
              onChange={doSetUploadMode}
            />
          </div>
        </div>
        <div className={'orderList-header'}>
          <span className={'dib'}>{t('orderListdesc')}</span>
        </div>
        <WatchListInput
          onFilterWatchList={handleFilterWatchList}
          handleFileChange={handleFileChange}
          handleExport={handleExport}
          emitFetchModal={emitFetchModal}
        />
      </>}

      {loading ? <Spinner label={t('Loading')}/>
        : <OrderList
          isWatchOne={isWatchOne}
          gateway={gateway}
          onAddPool={handleAddPool} onToggleBtn={handleToggleBtn}
          watchList={tableData}/>
      }
      <MDevGuide />
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
