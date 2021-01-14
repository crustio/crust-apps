// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { memo } from '@polkadot/api-derive/util';
import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

function parseDetails (stashId, controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure, stakingLedgerOpt) {
  return {
    accountId: stashId,
    controllerId: controllerIdOpt && controllerIdOpt.unwrapOr(null),
    exposure,
    nominators: nominatorsOpt.isSome ? nominatorsOpt.unwrap().targets : [],
    rewardDestination,
    stakingLedger: stakingLedgerOpt.unwrapOrDefault(),
    stashId,
    validatorPrefs
  };
}

function getLedgers (api, optIds, { withLedger = false }) {
  const ids = optIds.filter((opt) => withLedger && !!opt && opt.isSome).map((opt) => opt.unwrap());
  const emptyLed = api.registry.createType('Option<StakingLedger>');

  return (ids.length ? api.query.staking.ledger.multi(ids) : of([])).pipe(map((optLedgers) => {
    let offset = -1;

    return optIds.map((opt) => opt && opt.isSome ? optLedgers[++offset] || emptyLed : emptyLed);
  }));
}

function getStashInfo (api, stashIds, activeEra, { withController,
  withDestination,
  withExposure,
  withLedger,
  withNominations,
  withPrefs }) {
  const emptyNoms = api.registry.createType('Option<Nominations>');
  const emptyRewa = api.registry.createType('RewardDestination');
  const emptyExpo = api.registry.createType('Exposure');
  const emptyPrefs = api.registry.createType('ValidatorPrefs');

  return combineLatest([withController || withLedger ? api.query.staking.bonded.multi(stashIds) : of(stashIds.map(() => null)), withNominations ? api.query.staking.guarantors.multi(stashIds) : of(stashIds.map(() => emptyNoms)), withDestination ? api.query.staking.payee.multi(stashIds) : of(stashIds.map(() => emptyRewa)), withPrefs ? api.query.staking.validators.multi(stashIds) : of(stashIds.map(() => emptyPrefs)), withExposure ? api.query.staking.erasStakers.multi(stashIds.map((stashId) => [activeEra, stashId])) : of(stashIds.map(() => emptyExpo))]);
}

function getBatch (api, activeEra, stashIds, flags) {
  return getStashInfo(api, stashIds, activeEra, flags).pipe(switchMap(([controllerIdOpt, nominatorsOpt, rewardDestination, validatorPrefs, exposure]) => getLedgers(api, controllerIdOpt, flags).pipe(map((stakingLedgerOpts) => stashIds.map((stashId, index) => parseDetails(stashId, controllerIdOpt[index], nominatorsOpt[index], rewardDestination[index], validatorPrefs[index], exposure[index], stakingLedgerOpts[index]))))));
} //

/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */

export function query (instanceId, api) {
  return memo(instanceId, (accountId, flags) => api.derive.staking.queryMulti([accountId], flags).pipe(map(([first]) => first)));
}

export function queryMulti (instanceId, api) {
  return memo(instanceId, (accountIds, flags) => accountIds.length
    ? api.derive.session.indexes().pipe(switchMap(({ activeEra }) => {
      const stashIds = accountIds.map((accountId) => api.registry.createType('AccountId', accountId));

      return getBatch(api, activeEra, stashIds, flags);
    }))
    : of([]));
}
