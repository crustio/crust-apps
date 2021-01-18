// [object Object]
// SPDX-License-Identifier: Apache-2.0

import dayjs from 'dayjs';
import _ from 'lodash';

import { ACTIONS } from './consts';

const bundle = {
  name: 'orders',
  persistActions: [
    ACTIONS.ADD
  ],
  reducer: (state = { watchList: [] }, action) => {
    switch (action.type) {
      case ACTIONS.FETCH:
        return { ...state, watchList: action.payload };
      case ACTIONS.ADD:
        return { ...state, watchList: [...state.watchList, action.payload] };
      default:
        return state;
    }
  },
  doAddOrder: ({ fileCid, fileSize }) => ({ dispatch }) => {
    const watchItem = {
      fileCid,
      fileSize,
      startTime: dayjs().valueOf(),
      expireTime: 0,
      fileStatus: 0,
      pinsCount: 0
    };

    dispatch({ type: ACTIONS.ADD, payload: watchItem });
  },
  selectWatchList: (state) => {
    return state.orders.watchList;
  }

};

export default bundle;
