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
    'selectIpfsConnected',
    (failed, hash, ipfsConnected) => {
      hash = getRealPath(hash);

      if (!ipfsConnected && hash !== '/welcome' && !hash.startsWith('/settings')) {
        return { actionCreator: 'doUpdateHash', args: ['#/storage/welcome'] };
      }
    }
  )
};
