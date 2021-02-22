// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { ACTIONS } from './consts';

const bundle = { name: 'orders',
  persistActions: [
    ACTIONS.ADD,
    ACTIONS.FETCH
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
  doFetchWatchList: (_list) => ({ dispatch }) => {
    dispatch({ type: ACTIONS.FETCH, payload: _list });
  },
  doAddOrder: ({ fileCid }) => ({ dispatch, store }) => {
    const CidList = store.selectWatchedCidList();

    const watchItem = {
      fileCid,
      fileSize: 0,
      startTime: 0,
      expireTime: 0,
      fileStatus: 'PENDING',
      confirmedReplicas: 0,
      globalReplicas: 0,
      insertAt: (new Date()).valueOf()
    };

    if (CidList.indexOf(fileCid) > -1) {
      return;
    }

    dispatch({ type: ACTIONS.SELECTED, payload: [] });
    dispatch({ type: ACTIONS.ADD, payload: watchItem });
  },
  doSelectedItems: (fileCids) => ({ dispatch, store }) => {
    dispatch({ type: ACTIONS.SELECTED, payload: fileCids });
  },
  doRemoveWatchItems: (fileCids) => ({ dispatch, store }) => {
    const watchList = store.selectWatchList();

    for (const idx in fileCids) {
      const _idx = watchList.findIndex((item) => fileCids[idx] === item.fileCid);

      watchList.splice(_idx, 1);
    }

    dispatch({ type: ACTIONS.SELECTED, payload: [] });
    dispatch({ type: ACTIONS.FETCH, payload: watchList });
  },
  doUpdateWatchItem: (fileCid, info) => ({ dispatch, store }) => {
    const watchList = store.selectWatchList();
    console.log(watchList);
    const _idx = watchList.findIndex((item) => fileCid === item.fileCid);
    watchList[_idx] = { ...watchList[_idx], ...info };
    dispatch({ type: ACTIONS.FETCH, payload: watchList });
  },
  selectWatchList: (state) => state.orders.watchList,
  selectWatchedCidList: (state) => state.orders.watchList.map((item) => item.fileCid),
  selectSelectedCidList: (state) => state.orders.selectedCidList || [] };

export default bundle;
