// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './index.css';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import OrderModal from '../files/modals/order-modal/OrderModal';
import OrderList from './OrderList';
import WatchListInput from './WatchListInput';
import FileSaver from 'file-saver';
import _ from 'lodash';

const Order = ({ t, watchList }) => {
  const [modalShow, toggleModal] = useState(false);
  const [tableData, setTableData] = useState(watchList);
  const [title, setTitle] = useState('order');
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    setTableData(watchList);
  }, [watchList]);

  const handleFilterWatchList = (fileCid) => {
    if (!fileCid) {
      setTableData(watchList);
    } else {
      const target = watchList.find((item) => item.fileCid === fileCid);

      target && setTableData([target]);
    }
  };

  const handleToggleBtn = (type, item) => {
    // renew, retry, speed.
    setTitle(type);
    setFileInfo({ cid: item.fileCid, originalSize: item.fileSize });
    toggleModal(true);
  };
  let timer = null

  const handleExport = () =>{
    const _list = watchList.map(_item => ({fileCid: _item.fileCid, comment: _item.comment}))
    const blob = new Blob([JSON.stringify(_list)], { type: 'application/json; charset=utf-8' });
    FileSaver.saveAs(blob, `watchList.json`);
  };
  const handleImport = () => {

  }

  return (
    <div className={'w-100'}>
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

      <div className={'w-100 btn-wrapper flex-l'}>
        <button className='btn'
          onClick={() => {
            toggleModal(true);
          }}>{t('actions.addOrder')}</button>
          <div style={{marginLeft: 'auto'}}>
          <button className='btn' onClick={handleImport}>导入</button>
            &nbsp;&nbsp;
            <button className='btn' onClick={_.throttle(() => {
              handleExport()
            }, 2000)
            }>导出</button>
        </div>
      </div>
      <div className={'orderList-header'}>
        <span className={'dib'}>{t('orderListdesc')}</span>
      </div>
      <WatchListInput
        onFilterWatchList={handleFilterWatchList}
      />
      {tableData
        ? <OrderList onToggleBtn={handleToggleBtn}
          watchList={tableData}/>
        : <div>noone</div>}
    </div>
  );
};

export default connect('doAddOrder', 'selectWatchList', 'selectWatchedCidList', withTranslation('order')(Order));
