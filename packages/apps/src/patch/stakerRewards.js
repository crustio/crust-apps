
// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { memo } from '@polkadot/api-derive/util';
import { BN_BILLION, BN_ZERO } from '@polkadot/util';
import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

function ownKeys (object, enumerableOnly) {
  const keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread (target) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); }
  }

  return target;
}

function parseRewards (api, stashId, [erasPoints, erasPrefs, erasRewards], exposures) {
  return exposures.map(({ era,
    isEmpty,
    isValidator,
    nominating,
    validators: eraValidators }) => {
    const { eraPoints,
      validators: allValPoints } = erasPoints.find((p) => p.era.eq(era)) || {
      eraPoints: BN_ZERO,
      validators: {}
    };
    const { eraReward } = erasRewards.find((r) => r.era.eq(era)) || {
      eraReward: api.registry.createType('Balance')
    };
    const { validators: allValPrefs } = erasPrefs.find((p) => p.era.eq(era)) || {
      validators: {}
    };
    const validators = {};
    const stakerId = stashId.toString();

    Object.entries(eraValidators).forEach(([validatorId, exposure]) => {
      let _allValPrefs$validato;

      const valPoints = allValPoints[validatorId] || BN_ZERO;
      const valComm = ((_allValPrefs$validato = allValPrefs[validatorId]) === null || _allValPrefs$validato === void 0 ? void 0 : _allValPrefs$validato.guarantee_fee.unwrap()) || BN_ZERO;
      const expTotal = exposure.total.unwrap();
      let avail = BN_ZERO;
      let value;

      if (!(expTotal.isZero() || valPoints.isZero() || eraPoints.isZero())) {
        avail = eraReward.mul(valPoints).div(eraPoints);
        const valCut = valComm.mul(avail).div(BN_BILLION);
        let staked;

        if (validatorId === stakerId) {
          staked = exposure.own.unwrap();
        } else {
          const stakerExp = exposure.others.find(({ who }) => who.eq(stakerId));

          staked = stakerExp ? stakerExp.value.unwrap() : BN_ZERO;
        }

        value = avail.sub(valCut).imul(staked).div(expTotal).iadd(validatorId === stakerId ? valCut : BN_ZERO);
      }

      validators[validatorId] = {
        total: api.registry.createType('Balance', avail),
        value: api.registry.createType('Balance', value)
      };
    });

    return {
      era,
      eraReward,
      isEmpty,
      isValidator,
      nominating,
      validators
    };
  });
}

function allUniqValidators (rewards) {
  return rewards.reduce(([all, perStash], rewards) => {
    const uniq = [];

    perStash.push(uniq);
    rewards.forEach(({ validators }) => Object.keys(validators).forEach((validatorId) => {
      if (!uniq.includes(validatorId)) {
        uniq.push(validatorId);

        if (!all.includes(validatorId)) {
          all.push(validatorId);
        }
      }
    }));

    return [all, perStash];
  }, [[], []]);
}

function removeClaimed (validators, queryValidators, reward) {
  const rm = [];

  Object.keys(reward.validators).forEach((validatorId) => {
    const index = validators.indexOf(validatorId);

    if (index !== -1) {
      const valLedger = queryValidators[index].stakingLedger;

      if (valLedger !== null && valLedger !== void 0 && valLedger.claimedRewards.some((era) => reward.era.eq(era))) {
        rm.push(validatorId);
      }
    }
  });
  rm.forEach((validatorId) => {
    delete reward.validators[validatorId];
  });
}

function filterRewards (eras, valInfo, { rewards,
  stakingLedger }) {
  const filter = eras.filter((era) => !stakingLedger.claimedRewards.some((e) => e.eq(era)));
  const validators = valInfo.map(([v]) => v);
  const queryValidators = valInfo.map(([, q]) => q);

  return rewards.filter(({ isEmpty }) => !isEmpty).filter((reward) => {
    if (!filter.some((filter) => reward.era.eq(filter))) {
      return false;
    }

    reward.isStakerPayout = true;
    removeClaimed(validators, queryValidators, reward);

    return true;
  }).filter(({ validators }) => Object.keys(validators).length !== 0).map((reward) => _objectSpread(_objectSpread({}, reward), {}, {
    nominators: reward.nominating.filter((n) => reward.validators[n.validatorId])
  }));
}

export function _stakerRewardsEras (instanceId, api) {
  return memo(instanceId, (eras, withActive) => combineLatest([api.derive.staking._erasPoints(eras, withActive), api.derive.staking._erasPrefs(eras, withActive), api.derive.staking._erasRewards(eras, withActive)]));
}

export function _stakerRewards (instanceId, api) {
  return memo(instanceId, (accountIds, eras, withActive) => combineLatest([api.derive.staking.queryMulti(accountIds, {
    withLedger: true
  }), api.derive.staking._stakerExposures(accountIds, eras, withActive), api.derive.staking._stakerRewardsEras(eras, withActive)]).pipe(switchMap(([queries, exposures, erasResult]) => {
    const allRewards = queries.map(({ stakingLedger,
      stashId }, index) => !stashId || !stakingLedger ? [] : parseRewards(api, stashId, erasResult, exposures[index]));

    if (withActive) {
      return of(allRewards);
    }

    const [allValidators, stashValidators] = allUniqValidators(allRewards);

    return api.derive.staking.queryMulti(allValidators, {
      withLedger: true
    }).pipe(map((queriedVals) => {
      return queries.map(({ stakingLedger }, index) => {
        const rewards = allRewards[index];
        const ownValidators = stashValidators[index].map((validatorId) => [validatorId, queriedVals.find((q) => q.accountId.eq(validatorId))]);

        return filterRewards(eras, ownValidators, {
          rewards,
          stakingLedger
        });
      });
    }));
  })));
}

export function stakerRewards (instanceId, api) {
  return memo(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap((eras) => api.derive.staking._stakerRewards([accountId], eras, withActive)), map(([first]) => first)));
}

export function stakerRewardsMultiEras (instanceId, api) {
  return memo(instanceId, (accountIds, eras) => accountIds.length && eras.length ? api.derive.staking._stakerRewards(accountIds, eras, false) : of([]));
}

export function stakerRewardsMulti (instanceId, api) {
  return memo(instanceId, (accountIds, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe(switchMap((eras) => api.derive.staking.stakerRewardsMultiEras(accountIds, eras))));
}
