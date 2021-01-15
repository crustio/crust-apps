// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import OrderList from './OrderList';

const Order = ({ doFetchOrders, orders }) => {
  useEffect(() => {
    doFetchOrders();
    console.log(orders, 'orders');
  }, []);

  return <div className={'w-100'}>
    <OrderList/>
  </div>;
};

export default connect('doFetchOrders', 'selectWatchList', Order);
