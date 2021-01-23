// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './index.css';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import OrderModal from '../files/modals/order-modal/OrderModal';
import OrderList from './OrderList';
import WatchListInput from './WatchListInput';

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

      <div className={'w-100 btn-wrapper'}>
        <button className='btn'
          onClick={() => {
            toggleModal(true);
          }}>{t('actions.addOrder')}</button>
      </div>
      <h3>{t('watchList')}</h3>
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
