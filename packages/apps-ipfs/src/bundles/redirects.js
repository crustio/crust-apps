// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createSelector } from 'redux-bundler';
import { getRealPath } from '@polkadot/apps-ipfs/bundles/files/utils';

export default {
  name: 'redirects',

  reactToEmptyHash: createSelector(
    'selectHash',
    (hash) => {
      if (hash === '') {
        return { actionCreator: 'doUpdateHash', args: ['#/storage'] };
      }
    }
  ),

  reactToIpfsConnectionFail: createSelector(
    'selectIpfsInitFailed',
    'selectHash',
    'selectNodeBandwidthLastSuccess',
    'selectNodeBandwidthLastError',
    'selectIpfsReady',
    (failed, hash, lastSuccess, lastError) => {
      hash = getRealPath(hash);

      if (failed && hash !== '/welcome') {
        return { actionCreator: 'doUpdateHash', args: ['#/storage/welcome'] };
      }

      if (lastSuccess && lastError && lastSuccess < lastError && hash !== '/welcome') {
        return { actionCreator: 'doUpdateHash', args: ['#/storage/welcome'] };
      }
    }
  )
};
