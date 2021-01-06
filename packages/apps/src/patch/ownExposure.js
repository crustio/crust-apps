// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports._ownExposure = _ownExposure;
exports.ownExposure = ownExposure;
exports._ownExposures = _ownExposures;
exports.ownExposures = ownExposures;

const _rxjs = require('rxjs');

const _operators = require('rxjs/operators');

const _util = require('@polkadot/api-derive/util');

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const CACHE_KEY = 'ownExposure';

function _ownExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}-${accountId.toString()}`;
    const cached = withActive ? undefined : _util.deriveCache.get(cacheKey);

    return cached
      ? (0, _rxjs.of)(cached)
      : api.queryMulti([[api.query.staking.erasStakers, [era, accountId]], [api.query.staking.erasStakers, [era, accountId]]]).pipe((0, _operators.map)(([clipped, exposure]) => {
        const value = {
          clipped,
          era,
          exposure
        };

        !withActive && _util.deriveCache.set(cacheKey, value);

        return value;
      }));
  });
}

function ownExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, era) => api.derive.staking._ownExposure(accountId, era, true));
}

function _ownExposures (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, eras, withActive) => eras.length ? (0, _rxjs.combineLatest)(eras.map((era) => api.derive.staking._ownExposure(accountId, era, withActive))) : (0, _rxjs.of)([]));
}

function ownExposures (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, withActive = false) => {
    return api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)((eras) => api.derive.staking._ownExposures(accountId, eras, withActive)));
  });
}
