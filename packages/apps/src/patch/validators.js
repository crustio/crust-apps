// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { memo } from '@polkadot/api-derive/util';
import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

export function nextElected (instanceId, api) {
  return memo(instanceId, () => api.query.staking.erasAuthoringPayout ? api.derive.session.indexes().pipe( // only populate for next era in the last session, so track both here - entries are not
  // subscriptions, so we need a trigger - currentIndex acts as that trigger to refresh
    switchMap(({ currentEra }) => api.query.staking.erasAuthoringPayout.keys(currentEra)), map((keys) => keys.map(({ args: [, accountId] }) => accountId))) : api.query.staking.currentElected());
}
/**
 * @description Retrieve latest list of validators
 */

export function validators (instanceId, api) {
  return memo(instanceId, () => // Sadly the node-template is (for some obscure reason) not comprehensive, so while the derive works
  // in all actual real-world deployed chains, it does create some confusion for limited template chains
    combineLatest([api.query.session ? api.query.session.validators() : of([]), api.query.staking ? api.derive.staking.nextElected() : of([])]).pipe(map(([validators, nextElected]) => ({
      nextElected: nextElected.length ? nextElected : validators,
      validators
    }))));
}
