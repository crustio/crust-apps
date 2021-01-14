// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { filterEras } from '@polkadot/api-derive/staking/util';
import { deriveCache, memo } from '@polkadot/api-derive/util';
import { of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

const CACHE_KEY = 'eraRewards';

function mapRewards (eras, optRewards) {
  return eras.map((era, index) => ({
    era,
    eraReward: optRewards[index].unwrapOrDefault()
  }));
}

export function _erasRewards (instanceId, api) {
  return memo(instanceId, (eras, withActive) => {
    if (!eras.length) {
      return of([]);
    }

    const cached = withActive ? [] : eras.map((era) => deriveCache.get(`${CACHE_KEY}-${era.toString()}`)).filter((value) => !!value);
    const remaining = filterEras(eras, cached);

    if (!remaining.length) {
      return of(cached);
    }

    return api.query.staking.erasStakingPayout.multi(remaining).pipe(map((optRewards) => {
      const query = mapRewards(remaining, optRewards);

      !withActive && query.forEach((q) => deriveCache.set(`${CACHE_KEY}-${q.era.toString()}`, q));

      return eras.map((era) => cached.find((cached) => era.eq(cached.era)) || query.find((query) => era.eq(query.era)));
    }));
  });
}

export function erasRewards (instanceId, api) {
  return memo(instanceId, (withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap((eras) => api.derive.staking._erasRewards(eras, withActive))));
}
