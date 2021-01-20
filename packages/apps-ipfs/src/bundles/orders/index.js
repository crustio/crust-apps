// [object Object]
// SPDX-License-Identifier: Apache-2.0

import _ from 'lodash';

import { ACTIONS } from './consts';

const bundle = { name: 'orders',
  persistActions: [
    ACTIONS.ADD
  ],
  reducer: (state = { watchList: [], selectedCidList: [] }, action) => {
    switch (action.type) {
      case ACTIONS.FETCH:
        return { ...state, watchList: action.payload };
      case ACTIONS.ADD:
        return { ...state, watchList: [...state.watchList, action.payload] };
      case ACTIONS.SELECTED:
        return { ...state, selectedCidList: action.payload };
      default:
        return state;
    }
  },
  doAddOrder: ({ fileCid }) => ({ dispatch }) => {
    const watchItem = {
      fileCid,
      fileSize: 0,
      startTime: 0,
      expireTime: 0,
      fileStatus: 0,
      pinsCount: 0,
      insertAt: (new Date()).valueOf()
    };

    dispatch({ type: ACTIONS.ADD, payload: watchItem });
  },
  doSelectedItems: (fileCids) => ({ dispatch, store }) => {
    dispatch({ type: ACTIONS.SELECTED, payload: fileCids });
  },
  doRemoveWatchItems: (fileCids) => ({ dispatch, store }) => {
    const watchList = store.selectWatchList();

    for (const fileCid in fileCids) {
      const idx = watchList.findIndex((item) => fileCid === item.fileCid);

      watchList.splice(idx, 1);
    }

    dispatch({ type: ACTIONS.FETCH, payload: watchList });
    this.doSelectedItems([]);
  },
  selectWatchList: (state) => state.orders.watchList,
  selectWatchedCidList: (state) => state.orders.watchList.map((item) => item.fileCid),
  selectSelectedCidList: (state) => state.orders.selectedCidList };

export default bundle;
