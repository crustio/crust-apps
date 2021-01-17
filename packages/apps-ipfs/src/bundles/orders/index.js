// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { createAsyncResourceBundle, createSelector } from 'redux-bundler';

import { ACTIONS } from "./consts";

const bundle = createAsyncResourceBundle({
  name: "orders",
  actionBaseType: "ORDERS",
  getPromise: () => [],
  persist: true,
  checkIfOnline: false
});
const asyncResourceReducer = bundle.reducer;

bundle.reducer = (state, action) => {
  const asyncResult = asyncResourceReducer(state, action);

  switch (action.type) {
    case ACTIONS.FETCH:
      return { ...asyncResult, watchList: action.payload };
    case ACTIONS.ADD:
      return { ...asyncResult, watchList: [...state.watchList, action.payload] };
    default:
      return asyncResult;
  }
};

bundle.doFetchOrders = state => ({ dispatch }) => {
  const orders = [
    {
      fileCID: "123",
      fileSize: "123121",
      startTime: "12312",
      expireTime: "1221",
      fileStatus: 1,
      pinsCount: 2
    }
  ];

  dispatch({ type: ACTIONS.FETCH, payload: orders });
};
bundle.doAddOrder = order => ({ dispatch }) => {
  console.log(order)
  dispatch({ type: ACTIONS.ADD, payload: order });
};

bundle.selectWatchList = state => {
  return state.orders.watchList;
};

export default bundle;
