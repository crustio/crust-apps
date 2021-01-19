// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './index.css';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import OrderModal from '../files/modals/order-modal/OrderModal';
import OrderList from './OrderList';
import WatchListInput from './WatchListInput';

const Order = ({ doAddOrder, doFetchOrders, watchList, watchedCidList }) => {
  const [modalShow, toggleModal] = useState(false);
  const [tableData, setTableData] = useState(watchList);

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

  return (
    <div className={'w-100'}>
      {
        modalShow && <OrderModal
          onChange={() => {
            console.log('change');
          }}
          onClose={() => {
            toggleModal(false);
          }}/>}

      <div className={'w-100 btn-wrapper'}>
        <button className='btn'
          onClick={() => {
            toggleModal(true);
          }}>添加订单</button>
      </div>
      <h3>关注列表</h3>
      <WatchListInput onAddWatchItem={() => {
        console.log(123);
      }}
      onFilterWatchList={handleFilterWatchList}/>
      {tableData ? <OrderList watchList={tableData} /> : <div>noone</div>}
    </div>
  );
};

export default connect('doAddOrder', 'selectWatchList', 'selectWatchedCidList', Order);
