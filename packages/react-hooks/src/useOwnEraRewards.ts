// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveEraPoints, DeriveEraRewards, DeriveStakerReward, DeriveStakingOverview, DeriveStakingAccount, DeriveStakerRewardValidator } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces/runtime';

import { EraIndex, Exposure, StakingLedger } from '@polkadot/types/interfaces';
import { StakerState } from './types';

import { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { BN_ZERO } from '@polkadot/util';

import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
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

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]], stakingAccounts: DeriveStakingAccount[]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};
  const electedIds = stakingAccounts.map(e => e.accountId.toString());

  for (const [index, a] of available.entries()) {
    const tmpEra: string[] = [];
    for (const eraReward of a) {
      const tmpNominating: string[] = [];
      for (const e in eraReward.nominating) {
        const sa = stakingAccounts.find(({ accountId }) => accountId.eq(eraReward.nominating[e].validatorId))
        if (sa?.stakingLedger.claimedRewards.includes(eraReward.era)) {
          tmpNominating.push(sa?.accountId.toString());
        }
      }
      
      const tmp = eraReward.nominating.filter( e => !tmpNominating.includes(e.validatorId) && electedIds.includes(e.validatorId));

      eraReward.nominating = tmp;
      const tmpValidators: Record<string, DeriveStakerRewardValidator> = {};
      Object.entries(eraReward.validators).forEach(([validatorId, { total ,value }]): void => {
        if (!tmpNominating.includes(validatorId) && electedIds.includes(validatorId)) {
          tmpValidators[validatorId] = {
            total: total,
            value
          }
        } 
      })
      eraReward.validators = tmpValidators;
      if (eraReward.nominating.length == 0) {
        tmpEra.push(eraReward.era.toString());
      }
    }
    available[index] = a.filter(e => !tmpEra.includes(e.era.toString()));
  }

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index].filter(({ eraReward }) => !eraReward.isZero());
  });
  
  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

function getValRewards (validatorEras: ValidatorWithEras[], erasPoints: DeriveEraPoints[], erasRewards: DeriveEraRewards[], eraStashExposure: EraStashExposure[]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};
  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find((p) => p.era.eq(era));
      const eraRewards = erasRewards.find((r) => r.era.eq(era));
      const eraExposure = eraStashExposure.find((e) => e.era.eq(era) && e.stashId === stashId.toString())

      if (eraPoints?.eraPoints.gt(BN_ZERO) && eraPoints?.validators[stashId] && eraRewards) {
        const reward = eraPoints.validators[stashId].mul(eraRewards.eraReward).div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = registry.createType('Balance', reward);

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
      } else if (eraExposure?.exposure.own.unwrap().gtn(0)) {
        if (!allRewards[stashId]) {
          allRewards[stashId] = [];
        }
        allRewards[stashId].push({
          era,
          eraReward: registry.createType('Balance', 1),
          isEmpty: false,
          isValidator: true,
          nominating: [],
          validators: {
            [stashId]: {
              total: registry.createType('Balance', 1),
              value: registry.createType('Balance', 1)
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

export default function useOwnEraRewards (maxEras?: number, ownValidators?: StakerState[]): OwnRewards {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric);
  const [{ filteredEras, validatorEras }, setFiltered] = useState<Filtered>({ filteredEras: [], validatorEras: [] });
  const [state, setState] = useState<OwnRewards>({ isLoadingRewards: true, rewardCount: 0 });
  const stakerRewards = useCall<[[string[]], DeriveStakerReward[][]]>(!ownValidators?.length && !!filteredEras.length && stashIds && api.derive.staking?.stakerRewardsMultiEras, [stashIds, filteredEras], { withParams: true });
  const erasPoints = useCall<DeriveEraPoints[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasPoints, [filteredEras, false]);
  const erasRewards = useCall<DeriveEraRewards[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasRewards, [filteredEras, false]);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const allValidators = stakingOverview && [ ...stakingOverview.validators, ...stakingOverview.nextElected ];
  const stakingAccounts = useCall<DeriveStakingAccount[]>(allValidators && api.derive.staking.accounts, [allValidators]);
  const [eraStashExposure, setEraStashExposure] = useState<EraStashExposure[]>([]);
  // const [queries, setQueries] = useState<[EraIndex, string][]>([]);
  // const erasExposures = useCall<Exposure[]>(queries && api.query.staking.erasStakers.multi, [queries]);
  
  // useEffect(() => {
  //   const query: [EraIndex, string][] = [];
  //   if (allValidators && filteredEras) {
  //     for (const v of allValidators) {
  //       filteredEras.forEach( era => query.push([era, v.toString()]))
  //     }
  //     setQueries(query);
  //   }
  // }, [allValidators, filteredEras])

  // useEffect(() => {

  //   if (erasExposures?.length && queries.length && erasExposures?.length === queries.length) {
  //     const tmp: EraStashExposure[] = []
  //     for (const [index, a] of queries.entries()) {
  //       tmp.push({
  //         era: a[0],
  //         stashId: a[1],
  //         exposure: erasExposures[index],
  //       })
  //     }
  //     setEraStashExposure(tmp);
  //   }

  // }, [queries, erasExposures])

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (allValidators && filteredEras && mountedRef.current) {
      const query: [EraIndex, string][] = [];
      for (const v of allValidators) {
        filteredEras.forEach( era => query.push([era, v.toString()]))
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
              exposure: exposures[index],
            })
          }
          console.log('tmp', JSON.stringify(tmp))
          setEraStashExposure(tmp);
        }
      }).then((_unsub): void => {
        unsub = _unsub;
      }).catch(console.error);
    }
    return (): void => {
      unsub && unsub();
    }; 
  }, [filteredEras])

  useEffect((): void => {
    setState({ allRewards: null, isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras, ownValidators]);

  useEffect((): void => {
    if (allEras && maxEras) {
      const filteredEras = allEras.slice(-1 * maxEras);
      const validatorEras: ValidatorWithEras[] = [];

      if (ownValidators?.length) {
        ownValidators.forEach(({ stakingLedger, stashId }): void => {
          if (stakingLedger) {
            const eras = filteredEras.filter((era) => !stakingLedger.claimedRewards.some((c) => era.eq(c)));

            if (eras.length) {
              validatorEras.push({ eras, stashId });
            }
          }
        });
      }

      setFiltered({ filteredEras, validatorEras });
    }
  }, [allEras, maxEras, ownValidators]);

  useEffect((): void => {
    mountedRef.current && stakerRewards && !ownValidators && stakingAccounts && setState(
      getRewards(stakerRewards, stakingAccounts)
    );
  }, [mountedRef, ownValidators, stakerRewards, stakingAccounts]);

  useEffect((): void => {
    mountedRef && erasPoints && erasRewards && ownValidators && eraStashExposure && setState(
      getValRewards(validatorEras, erasPoints, erasRewards, eraStashExposure)
    );
  }, [erasPoints, erasRewards, mountedRef, ownValidators, validatorEras, eraStashExposure]);

  return state;
}
