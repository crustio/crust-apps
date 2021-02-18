// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createSelector } from 'redux-bundler';

import { ACTIONS } from './consts';
import { infoFromPath } from './utils';

/**
 * @typedef {import('./protocol').Model} Files
 * @typedef {Object} Model
 * @property {Files} files
 */

/**
 * @typedef {import('redux-bundler').Selectors<ReturnType<typeof selectors>>} Selectors
 */

const selectors = () => ({
  /**
   * @param {Model} state
   */
  selectFiles: (state) => state.files.pageContent,

  /**
   * @param {Model} state
   */
  selectPins: (state) => state.files.pins,
  /**
   * @param {Model} state
   */
  selectContracts: (state) => state.files.contracts,
  /**
   * @param {Model} state
   */
  selectFilesSize: (state) => state.files.mfsSize,

  /**
   * @param {Model} state
   */
  selectFilesIsFetching: (state) => state.files.pending.some((a) => a.type === ACTIONS.FETCH),

  /**
   * @param {Model} state
   */
  selectShowLoadingAnimation: (state) => {
    const pending = state.files.pending.find((a) => a.type === ACTIONS.FETCH);

    return pending ? (Date.now() - pending.start) > 1000 : false;
  },

  /**
   * @param {Model} state
   */
  selectFilesSorting: (state) => state.files.sorting,

  /**
   * @param {Model} state
   */
  selectFilesPending: (state) =>
    state.files.pending.filter((s) => s.type === ACTIONS.WRITE && s.message != null),

  /**
   * @param {Model} state
   */
  selectFilesFinished: (state) =>
    state.files.finished.filter((s) => s.type === ACTIONS.WRITE),

  /**
   * @param {Model} state
   */
  selectFilesHasError: (state) => state.files.failed.length > 0,

  /**
   * @param {Model} state
   */
  selectFilesErrors: (state) => state.files.failed,

  selectFilesPathInfo: createSelector(
    'selectRouteInfo',
    /**
     * @param {object} routeInfo
     * @param {string} routeInfo.url
     */
    (routeInfo) => {
      return infoFromPath(routeInfo.url);
    }
  )
});

export default selectors;
