// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionInfo, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useEffect, useMemo, useState } from 'react';

import { calcInflation, useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { arrayFlatten, BN_HUNDRED, BN_MAX_INTEGER, BN_ONE, BN_ZERO } from '@polkadot/util';
import { validatorApy } from '.';

interface LastEra {
  activeEra: BN;
  eraLength: BN;
  lastEra: BN;
  sessionLength: BN;
}

const EMPTY_PARTIAL = {};
const DEFAULT_FLAGS_ELECTED = { withController: true, withExposure: true, withPrefs: true };
const DEFAULT_FLAGS_WAITING = { withController: true, withExposure: true, withPrefs: true };

function mapIndex (mapBy: TargetSortBy): (info: ValidatorInfo, index: number) => ValidatorInfo {
  return (info, index): ValidatorInfo => {
    info[mapBy] = index + 1;

    return info;
  };
}

function isWaitingDerive (derive: DeriveStakingElected | DeriveStakingWaiting): derive is DeriveStakingWaiting {
  return !(derive as DeriveStakingElected).nextElected;
}

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  const existing: string[] = [];

  return list
    .filter((a): boolean => {
      const s = a.accountId.toString();

      if (!existing.includes(s)) {
        existing.push(s);

        return true;
      }

      return false;
    })
    // .filter((a) => a.bondTotal.gtn(0))
    // ignored, not used atm
    // .sort((a, b) => b.commissionPer - a.commissionPer)
    // .map(mapIndex('rankComm'))
    .sort((a, b) => b.bondOther.cmp(a.bondOther))
    .map(mapIndex('rankBondOther'))
    .sort((a, b) => b.bondOwn.cmp(a.bondOwn))
    .map(mapIndex('rankBondOwn'))
    .sort((a, b) => b.bondTotal.cmp(a.bondTotal))
    .map(mapIndex('rankBondTotal'))
    // .sort((a, b) => b.validatorPayment.cmp(a.validatorPayment))
    // .map(mapIndex('rankPayment'))
    .sort((a, b) => a.stakedReturnCmp - b.stakedReturnCmp)
    .map(mapIndex('rankReward'))
    // ignored, not used atm
    // .sort((a, b) => b.numNominators - a.numNominators)
    // .map(mapIndex('rankNumNominators'))
    .sort((a, b) =>
      (b.stakedReturnCmp - a.stakedReturnCmp) ||
      (a.commissionPer - b.commissionPer) ||
      (b.rankBondTotal - a.rankBondTotal)
    )
    .map(mapIndex('rankOverall'))
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractSingle (api: ApiPromise, allAccounts: string[], derive: DeriveStakingElected | DeriveStakingWaiting, favorites: string[], { activeEra, eraLength, lastEra, sessionLength }: LastEra, validatorStakeLimit: ValidatorStakeLimit[], guarantors: Guarantor[], historyDepth?: BN): [ValidatorInfo[], Record<string, BN>] {
  const nominators: Record<string, BN> = {};
  const emptyExposure = api.createType('Exposure');
  const earliestEra = historyDepth && lastEra.sub(historyDepth).iadd(BN_ONE);
  const list = derive.info.map(({ accountId, exposure = emptyExposure, stakingLedger, validatorPrefs }): ValidatorInfo => {
    // some overrides (e.g. Darwinia Crab) does not have the own/total field in Exposure
    let [bondOwn, bondTotal] = exposure.total
      ? [exposure.own.unwrap(), exposure.total.unwrap()]
      : [BN_ZERO, BN_ZERO];
    const skipRewards = bondTotal.isZero();
    // some overrides (e.g. Darwinia Crab) does not have the value field in IndividualExposure
    const minNominated = (exposure.others || []).reduce((min: BN, { value = api.createType('Compact<Balance>') }): BN => {
      const actual = value.unwrap();

      return min.isZero() || actual.lt(min)
        ? actual
        : min;
    }, BN_ZERO);

    if (bondTotal.isZero()) {
      bondTotal = bondOwn = stakingLedger.total.unwrap();
    }

    const ownGuarantors = parseObj(exposure).others.map((e: { who: any; }) => e.who);

    let totalStaked = new BN(Number(parseObj(stakingLedger).active).toString());

    const ownGuarantorLedger = guarantors.filter(e => ownGuarantors.includes(e.accountId))

    for (const guarantor of ownGuarantorLedger) {
        for (const target of guarantor.targets) {
          if (target.who.toString() == accountId?.toString()) {
            totalStaked = totalStaked?.add(new BN(Number(target.value).toString()));
          }
        }
    }

    const key = accountId.toString();
    const lastEraPayout = !lastEra.isZero()
      ? stakingLedger.claimedRewards[stakingLedger.claimedRewards.length - 1]
      : undefined;

    // only use if it is more recent than historyDepth
    let lastPayout: BN | undefined = earliestEra && lastEraPayout && lastEraPayout.gt(earliestEra)
      ? lastEraPayout
      : undefined;

    if (lastPayout && !sessionLength.eq(BN_ONE)) {
      lastPayout = lastEra.sub(lastPayout).mul(eraLength);
    }

    const stakeLimitIndex = validatorStakeLimit.findIndex(e => e.accountId == accountId.toString())

    return {
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn,
      bondShare: 0,
      bondTotal,
      // @ts-ignore
      commissionPer: Math.floor(Number(validatorPrefs.guarantee_fee) / 10000000),
      exposure,
      isActive: !skipRewards,
      isBlocking: !!(validatorPrefs.blocked && validatorPrefs.blocked.isTrue),
      isElected: !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId)),
      isFavorite: favorites.includes(key),
      isNominating: (exposure.others || []).reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        nominators[nominator] = (nominators[nominator] || BN_ZERO).add(indv.value.toBn());

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key)),
      key,
      knownLength: activeEra.sub(stakingLedger.claimedRewards[0] || activeEra),
      lastPayout,
      minNominated,
      numNominators: (exposure.others || []).length,
      numRecentPayouts: earliestEra
        ? stakingLedger.claimedRewards.filter((era) => era.gte(earliestEra)).length
        : 0,
      rankBondOther: 0,
      rankBondOwn: 0,
      rankBondTotal: 0,
      rankNumNominators: 0,
      rankOverall: 0,
      rankReward: 0,
      skipRewards,
      stakedReturn: 0,
      stakedReturnCmp: 0,
      validatorPrefs,
      totalStaked,
      stakeLimit: validatorStakeLimit[stakeLimitIndex] ? validatorStakeLimit[stakeLimitIndex].stakeLimit: BN_ZERO,
      apy: 0
    };
  });

  return [list, nominators];
}

function extractInfo (api: ApiPromise, allAccounts: string[], electedDerive: DeriveStakingElected, waitingDerive: DeriveStakingWaiting, favorites: string[], totalIssuance: BN, lastEraInfo: LastEra, validatorStakeLimit: ValidatorStakeLimit[], guarantors: Guarantor[], totalReward: BN, validatorCount: number, historyDepth?: BN): Partial<SortedTargets> {
  const [elected, nominators] = extractSingle(api, allAccounts, electedDerive, favorites, lastEraInfo, validatorStakeLimit, guarantors, historyDepth);
  const [waiting, waitingNominators] = extractSingle(api, allAccounts, waitingDerive, favorites, lastEraInfo, validatorStakeLimit, guarantors);
  const electedTotals = elected
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
  const waitingTotals = waiting
  .filter(({ isActive }) => isActive)
  .map(({ bondTotal }) => bondTotal)
  const activeTotals = [...electedTotals, ...waitingTotals].sort((a, b) => a.cmp(b));
  const totalStaked = activeTotals.reduce((total: BN, value) => total.iadd(value), new BN(0));
  const avgStaked = totalStaked.divn(activeTotals.length);
  const inflation = calcInflation(api, totalStaked, totalIssuance);

  // add the explicit stakedReturn
  !avgStaked.isZero() && elected.forEach((e): void => {
    if (!e.skipRewards) {
      const adjusted = avgStaked.mul(BN_HUNDRED).imuln(inflation.stakedReturn).div(e.bondTotal);

      // in some cases, we may have overflows... protect against those
      // @ts-ignore
      e.stakedReturn = Number(adjusted.gt(BN_MAX_INTEGER) ? BN_MAX_INTEGER : adjusted) / BN_HUNDRED.toNumber();
      e.stakedReturnCmp = e.stakedReturn * (100 - e.commissionPer) / 100;
    }
  });

  // all validators, calc median commission
  const tmpMinNominated = Object.values(nominators).reduce((min: BN, value) => {
    return min.isZero() || value.lt(min)
      ? value
      : min;
  }, BN_ZERO);

  const minNominated = Object.values(waitingNominators).reduce((min: BN, value) => {
    return min.isZero() || value.lt(min)
      ? value
      : min;
  }, tmpMinNominated);
  const validators = sortValidators(arrayFlatten([elected, waiting])).map(e => calculateApy(totalReward, validatorCount, totalStaked, e));
  const commValues = validators.map(({ commissionPer }) => commissionPer).sort((a, b) => a - b);
  const midIndex = Math.floor(commValues.length / 2);
  const medianComm = commValues.length
    ? commValues.length % 2
      ? commValues[midIndex]
      : (commValues[midIndex - 1] + commValues[midIndex]) / 2
    : 0;

  // ids
  const waitingIds = waiting.map(({ key }) => key);
  const validatorIds = arrayFlatten([
    elected.map(({ key }) => key),
    waitingIds
  ]);
  const nominateIds = arrayFlatten([
    elected.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key),
    waiting.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key)
  ]);

  return {
    avgStaked,
    inflation,
    lowStaked: activeTotals[0] || BN_ZERO,
    medianComm,
    minNominated,
    nominateIds,
    nominators: Object.keys(nominators).concat(Object.keys(waitingNominators).filter((e) => !Object.keys(nominators).includes(e))),
    totalIssuance,
    totalStaked,
    validatorIds,
    validators,
    waitingIds
  };
}

const transformEra = {
  transform: ({ activeEra, eraLength, sessionLength }: DeriveSessionInfo): LastEra => ({
    activeEra,
    eraLength,
    lastEra: activeEra.isZero() ? BN_ZERO : activeEra.subn(1),
    sessionLength
  })
};

interface ValidatorStakeLimit {
  accountId: string;
  stakeLimit: BN;
}

interface Guarantor {
  accountId: string;
  targets: {
    who: string,
    value: BN
  }[];
}

const parseObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

const UNIT = new BN(1_000_000_000_000);

const calculateApy = (totalReward: BN, validatorCount: number, totalEffectiveStake: BN, validatorInfo: ValidatorInfo) => {
  const stakingReward = Number(totalReward.muln(0.8))
  const authringRewad = Number(totalReward.muln(0.2)) / validatorCount
  const guarantorStaked = UNIT;
  const rewardRate = Number(guarantorStaked) / (Number(validatorInfo.totalStaked) * 1.0)
  const ownEffective = Math.min(Number(validatorInfo.stakeLimit), Number(validatorInfo.totalStaked))
  const guarantee_fee = validatorInfo.commissionPer / 100.0;
  const validatorRate = ( ownEffective / (Number(totalEffectiveStake) * 1.0));
  let apy = 0
  if (validatorInfo.isElected) {
    apy = ownEffective ? rewardRate * ((stakingReward) * validatorRate + authringRewad) * 4 * guarantee_fee / 1000000000000 : 0
  } else {
    apy = ownEffective ? rewardRate * (stakingReward) * (validatorRate) * 4 * guarantee_fee / 1000000000000 : 0
  }
  validatorInfo.apy = apy
  validatorApy[validatorInfo.accountId.toString()] = apy
  return validatorInfo;
}

export default function useSortedTargets (favorites: string[], withLedger: boolean): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const historyDepth = useCall<BN>(api.query.staking.historyDepth);
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, [{ ...DEFAULT_FLAGS_ELECTED, withLedger }]);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo, [{ ...DEFAULT_FLAGS_WAITING, withLedger }]);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, transformEra);
  const [validatorStakeLimit, setValidatorStakeLimit] = useState<ValidatorStakeLimit[]>([]);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [validatorCount, setValidatorCount] = useState<number>(0);
  const [totalReward, setTotalReward] = useState<BN>(BN_ZERO);

  useEffect(() => {
    if (electedInfo && waitingInfo) {
      const queryInfo = [...electedInfo.validators, ...waitingInfo.waiting];
      api.query.staking.stakeLimit.multi(queryInfo).then(res => {
        const stakeLimits = parseObj(res)
        const validatorStakeLimit = stakeLimits.map((stakeLimit: any, index: number) => {
          return {
            accountId: queryInfo[index].toString(),
            stakeLimit: new BN(Number(stakeLimit).toString())
          }
        })
        setValidatorStakeLimit(validatorStakeLimit)
      })
    }
  }, [api, electedInfo, waitingInfo])

  useEffect(() => {
    api.query.staking.guarantors.entries().then(res => {
      const guarantors = res.map(([{ args: [accountId] }, value]) => {
        const targets = parseObj(value)
        return {
          accountId: accountId.toString(),
          targets: targets.targets
        }
      })
      setGuarantors(guarantors)
    })
    
  }, [lastEraInfo])

  useEffect(() => {
    if (lastEraInfo) {
      api.query.staking.validatorCount().then(res => {
        setValidatorCount(res.toNumber())
      })
      api.query.staking.erasStakingPayout(lastEraInfo.activeEra.toNumber() - 1).then((res) => {
        const erasStakingPayout = JSON.parse(JSON.stringify(res));
        const totalPayout = Number(erasStakingPayout) / 0.8;
  
        setTotalReward(new BN(totalPayout));
      });
    }
  }, [lastEraInfo])

  const partial = useMemo(
    () => electedInfo && lastEraInfo && totalIssuance && waitingInfo && validatorStakeLimit && guarantors && totalReward && validatorCount
      ? extractInfo(api, allAccounts, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, validatorStakeLimit, guarantors, totalReward, validatorCount, historyDepth)
      : EMPTY_PARTIAL,
    [api, allAccounts, electedInfo, favorites, historyDepth, lastEraInfo, totalIssuance, waitingInfo, validatorStakeLimit, totalReward, validatorCount]
  );

  return { inflation: { inflation: 0, stakedReturn: 0 }, medianComm: 0, minNominated: BN_ZERO, ...partial };
}
