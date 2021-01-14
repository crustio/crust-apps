// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports._ownSlash = _ownSlash;
exports.ownSlash = ownSlash;
exports._ownSlashes = _ownSlashes;
exports.ownSlashes = ownSlashes;

const _rxjs = require('rxjs');

const _operators = require('rxjs/operators');

const _util = require('@polkadot/api-derive/util');

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
const CACHE_KEY = 'ownSlash';

function _ownSlash (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}-${accountId.toString()}`;
    const cached = withActive ? undefined : _util.deriveCache.get(cacheKey);

    return cached
      ? (0, _rxjs.of)(cached)
      : api.queryMulti([[api.query.staking.guarantorSlashInEra, [era, accountId]], [api.query.staking.validatorSlashInEra, [era, accountId]]]).pipe((0, _operators.map)(([optNom, optVal]) => {
        const value = {
          era,
          total: optVal.isSome ? optVal.unwrap()[1] : optNom.unwrapOrDefault()
        };

        !withActive && _util.deriveCache.set(cacheKey, value);

        return value;
      }));
  });
}

function ownSlash (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, era) => api.derive.staking._ownSlash(accountId, era, true));
}

function _ownSlashes (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, eras, withActive) => eras.length ? (0, _rxjs.combineLatest)(eras.map((era) => api.derive.staking._ownSlash(accountId, era, withActive))) : (0, _rxjs.of)([]));
}

function ownSlashes (instanceId, api) {
  return (0, _util.memo)(instanceId, (accountId, withActive = false) => {
    return api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)((eras) => api.derive.staking._ownSlashes(accountId, eras, withActive)));
  });
}
