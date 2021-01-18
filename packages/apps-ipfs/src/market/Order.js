// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import OrderModal from '../files/modals/order-modal/OrderModal';
import OrderList from './OrderList';

const Order = ({ doAddOrder, doFetchOrders, watchList }) => {
  const [modalShow, toggleModal] = useState(false);

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

      <button onClick={() => {
        toggleModal(true);
      }}>添加</button>
      {watchList ? <OrderList watchList={watchList} /> : <div>noone</div>}
    </div>
  );
};

export default connect('doAddOrder', 'selectWatchList', Order);
