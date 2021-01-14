// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports._eraExposure = _eraExposure;
exports.eraExposure = eraExposure;
exports._erasExposure = _erasExposure;
exports.erasExposure = erasExposure;

const _rxjs = require('rxjs');

const _operators = require('rxjs/operators');

const _util = require('@polkadot/api-derive/util');

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const CACHE_KEY = 'eraExposure';

function mapStakers (era, stakers) {
  const nominators = {};
  const validators = {};

  stakers.forEach(([key, exposure]) => {
    const validatorId = key.args[1].toString();

    validators[validatorId] = exposure;
    exposure.others.forEach(({ who }, validatorIndex) => {
      const nominatorId = who.toString();

      nominators[nominatorId] = nominators[nominatorId] || [];
      nominators[nominatorId].push({
        validatorId,
        validatorIndex
      });
    });
  });

  return {
    era,
    nominators,
    validators
  };
}

function _eraExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (era, withActive) => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}`;
    const cached = withActive ? undefined : _util.deriveCache.get(cacheKey);

    return cached
      ? (0, _rxjs.of)(cached)
      : api.query.staking.erasStakers.entries(era).pipe((0, _operators.map)((stakers) => {
        const value = mapStakers(era, stakers);

        !withActive && _util.deriveCache.set(cacheKey, value);

        return value;
      }));
  });
}

function eraExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (era) => api.derive.staking._eraExposure(era, true));
}

function _erasExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (eras, withActive) => eras.length ? (0, _rxjs.combineLatest)(eras.map((era) => api.derive.staking._eraExposure(era, withActive))) : (0, _rxjs.of)([]));
}

function erasExposure (instanceId, api) {
  return (0, _util.memo)(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)((eras) => api.derive.staking._erasExposure(eras, withActive))));
}
