// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { ApiPromise } from '@polkadot/api';
import type { BalanceOf, EraIndex, Exposure } from '@polkadot/types/interfaces';
import type { StakerState } from './types';

import { useEffect, useState } from 'react';

import { DeriveEraPoints, DeriveEraRewards, DeriveStakerReward, DeriveStakerRewardValidator, DeriveStakingAccount, DeriveStakingOverview, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import { BN_ZERO } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface State {
  allRewards?: Record<string, DeriveStakerReward[]> | null;
  isLoadingRewards: boolean;
  rewardCount: number;
}

interface ValidatorWithEras {
  eras: EraIndex[];
  stashId: string;
}

interface Filtered {
  filteredEras: EraIndex[];
  validatorEras: ValidatorWithEras[];
}

interface EraStashExposure {
  era: EraIndex;
  stashId: string;
  exposure: Exposure;
}

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]], stakingAccounts: DeriveStakingAccount[], eraStakingPayouts: EraStakingPayout[]): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};
  const electedIds = stakingAccounts.map((e) => e.accountId.toString());

  for (const [index, a] of available.entries()) {
    const tmpEra: string[] = [];

    for (const eraReward of a) {
      const tmpNominating: string[] = [];

      for (const e in eraReward.nominating) {
        const sa = stakingAccounts.find(({ accountId }) => accountId.eq(eraReward.nominating[e].validatorId));

        if (sa?.stakingLedger.claimedRewards.includes(eraReward.era)) {
          tmpNominating.push(sa?.accountId.toString());
        }
      }

      const tmp = eraReward.nominating.filter((e) => !tmpNominating.includes(e.validatorId) && electedIds.includes(e.validatorId));

      eraReward.nominating = tmp;
      const tmpValidators: Record<string, DeriveStakerRewardValidator> = {};

      Object.entries(eraReward.validators).forEach(([validatorId, { total, value }]): void => {
        if (!tmpNominating.includes(validatorId) && electedIds.includes(validatorId)) {
          tmpValidators[validatorId] = {
            total: total,
            value
          };
        }
      });
      eraReward.validators = tmpValidators;

      if (eraReward.nominating.length == 0) {
        tmpEra.push(eraReward.era.toString());
      }
    }

    available[index] = a.filter((e) => !tmpEra.includes(e.era.toString()));
  }

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index].filter(({ eraReward, era }) => {
      const currentRewardStatus = eraStakingPayouts.find(eraStakingPayout => eraStakingPayout.era == era.toNumber())
      return !eraReward.isZero() && currentRewardStatus?.hasReward
    });
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

function getValRewards (api: ApiPromise, validatorEras: ValidatorWithEras[], erasPoints: DeriveEraPoints[], erasRewards: DeriveEraRewards[], eraStashExposure: EraStashExposure[], eraStakingPayouts: EraStakingPayout[]): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find((p) => p.era.eq(era));
      const eraRewards = erasRewards.find((r) => r.era.eq(era));
      const eraExposure = eraStashExposure.find((e) => e.era.eq(era) && e.stashId === stashId.toString());
      const eraStakingPayout = eraStakingPayouts.find((e) => e.era == era.toNumber());

      if (eraStakingPayout && eraStakingPayout.hasReward && eraPoints?.eraPoints.gt(BN_ZERO) && eraPoints?.validators[stashId] && eraRewards) {
        const reward = eraPoints.validators[stashId].mul(eraRewards.eraReward).div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = api.createType('Balance', reward);

          if (!allRewards[stashId]) {
            allRewards[stashId] = [];
          }

          allRewards[stashId].push({
            era,
            eraReward: eraRewards.eraReward,
            isEmpty: false,
            isValidator: true,
            nominating: [],
            validators: {
              [stashId]: {
                total,
                value: total
              }
            }
          });
        }
      } else if (eraStakingPayout && eraStakingPayout.hasReward && eraExposure?.exposure.total.unwrap().gtn(0)) {
        if (!allRewards[stashId]) {
          allRewards[stashId] = [];
        }

        allRewards[stashId].push({
          era,
          eraReward: api.createType('Balance', 1),
          isEmpty: false,
          isValidator: true,
          nominating: [],
          validators: {
            [stashId]: {
              total: api.createType('Balance', 1),
              value: api.createType('Balance', 1)
            }
          }
        });
      }
    });
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

interface EraStakingPayout {
  era: number;
  hasReward: boolean;
}

export function useOwnEraRewards (maxEras?: number, ownValidators?: StakerState[]): State {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric);
  const [{ filteredEras, validatorEras }, setFiltered] = useState<Filtered>({ filteredEras: [], validatorEras: [] });
  const [state, setState] = useState<State>({ isLoadingRewards: true, rewardCount: 0 });
  const stakerRewards = useCall<[[string[]], DeriveStakerReward[][]]>(!ownValidators?.length && !!filteredEras.length && stashIds && api.derive.staking?.stakerRewardsMultiEras, [stashIds, filteredEras], { withParams: true });
  const erasPoints = useCall<DeriveEraPoints[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasPoints, [filteredEras, false]);
  const erasRewards = useCall<DeriveEraRewards[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasRewards, [filteredEras, false]);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
  const allValidators = stakingOverview && waitingInfo && [...waitingInfo.waiting, ...stakingOverview.nextElected];
  const stakingAccounts = useCall<DeriveStakingAccount[]>(allValidators && api.derive.staking.accounts, [allValidators]);
  const [eraStashExposure, setEraStashExposure] = useState<EraStashExposure[]>([]);
  const [eraStakingPayouts, setEraStakingPayouts] = useState<EraStakingPayout[]>();

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (allValidators && filteredEras && mountedRef.current) {
      const query: [EraIndex, string][] = [];

      for (const v of allValidators) {
        filteredEras.forEach((era) => query.push([era, v.toString()]));
      }

      const fns: any[] = [
        [api.query.staking.erasStakers.multi as any, query]
      ];

      api.combineLatest<Exposure[]>(fns, ([exposures]): void => {
        const tmp: EraStashExposure[] = [];

        if (Array.isArray(exposures) && mountedRef.current && exposures.length && exposures.length === query.length) {
          for (const [index, a] of query.entries()) {
            tmp.push({
              era: a[0],
              stashId: a[1],
              exposure: exposures[index]
            });
          }

          setEraStashExposure(tmp);
        }
      }).then((_unsub): void => {
        unsub = _unsub;
      }).catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [filteredEras, allValidators]);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (filteredEras && mountedRef.current) {
      const query: number[] = [];
      filteredEras.forEach((era) => query.push(era.toNumber()));

      const fns: any[] = [
        [api.query.staking.erasStakingPayout.multi as any, query]
      ];

      api.combineLatest<BalanceOf[]>(fns, ([balanceOfs]): void => {
        const tmp: EraStakingPayout[] = [];
        const result = JSON.parse(JSON.stringify(balanceOfs))

        if (Array.isArray(result) && mountedRef.current && result.length && result.length === query.length) {
          for (const [index, a] of query.entries()) {
            tmp.push({
              era: a,
              hasReward: !!result[index]
            });
          }

          setEraStakingPayouts(tmp);
        }
      }).then((_unsub): void => {
        unsub = _unsub;
      }).catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [filteredEras]);

  useEffect((): void => {
    setState({ allRewards: null, isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras, ownValidators]);

  useEffect((): void => {
    if (allEras && maxEras) {
      const filteredEras = allEras.slice(-1 * maxEras);
      const validatorEras: ValidatorWithEras[] = [];

      if (allEras.length === 0) {
        setState({
          allRewards: {},
          isLoadingRewards: false,
          rewardCount: 0
        });
        setFiltered({ filteredEras, validatorEras });
      } else if (ownValidators?.length) {
        ownValidators.forEach(({ stakingLedger, stashId }): void => {
          if (stakingLedger) {
            const eras = filteredEras.filter((era) => !stakingLedger.claimedRewards.some((c) => era.eq(c)));

            if (eras.length) {
              validatorEras.push({ eras, stashId });
            }
          }
        });

        // When we have just claimed, we have filtered eras, but no validator eras - set accordingly
        if (filteredEras.length && !validatorEras.length) {
          setState({
            allRewards: {},
            isLoadingRewards: false,
            rewardCount: 0
          });
        }
      }

      setFiltered({ filteredEras, validatorEras });
    }
  }, [allEras, maxEras, ownValidators]);

  useEffect((): void => {
    mountedRef.current && stakerRewards && !ownValidators && stakingAccounts && eraStakingPayouts && setState(
      getRewards(stakerRewards, stakingAccounts, eraStakingPayouts)
    );
  }, [mountedRef, ownValidators, stakerRewards, stakingAccounts, eraStakingPayouts]);

  useEffect((): void => {
    mountedRef && erasPoints && erasRewards && ownValidators && eraStashExposure && eraStakingPayouts && setState(
      getValRewards(api, validatorEras, erasPoints, erasRewards, eraStashExposure, eraStakingPayouts)
    );
  }, [api, erasPoints, erasRewards, mountedRef, ownValidators, validatorEras, eraStashExposure, eraStakingPayouts]);

  return state;
}
