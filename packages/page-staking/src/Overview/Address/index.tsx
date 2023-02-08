// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveAccountInfo, DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { AccountId, ActiveEraInfo, Balance, Exposure, IndividualExposure, SlashingSpans, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
import type { NominatorValue } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, LinkExternal, Tooltip } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance, FormatPw } from '@polkadot/react-query';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';

import Favorite from './Favorite';
import StakeOther from './StakeOther';
import Status from './Status';
import ApyInfo from './ApyInfo';
import { validatorApy } from '@polkadot/app-staking';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  lastBlock?: string;
  nominatedBy?: NominatedByType[];
  points?: string;
  recentlyOnline?: DeriveHeartbeatAuthor;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity: boolean;
  validatorCount: number;
  totalReward: BN;
  totalEffectiveStake: BN;
}

interface StakingState {
  guarantee_fee?: string;
  nominators: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
  guarantee_fee_pref?: number;
}

export interface Guarantee extends Codec {
  targets: IndividualExposure[];
  total: Compact<Balance>;
  submitted_in: number;
  suppressed: boolean;
}

function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo): StakingState {
  let nominators: NominatorValue[] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure && exposure.total) {
    nominators = exposure.others.map(({ value, who }) => ({ nominatorId: who.toString(), value: value.unwrap() }));
    stakeTotal = exposure.total.unwrap();
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  // @ts-ignore
  const guarantee_fee = (validatorPrefs as ValidatorPrefs)?.guarantee_fee?.unwrap();
  const guarantee_fee_pref = guarantee_fee?.toNumber()/1000000000.0;

  return {
    guarantee_fee: guarantee_fee?.toHuman(),
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal,
    guarantee_fee_pref
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

const transformBonded = {
  transform: (value: Option<AccountId>): string | null =>
    value.isSome
      ? value.unwrap().toString()
      : null
};

const transformLedger = {
  transform: (value: Option<StakingLedger>): Balance | null =>
    value.isSome
      ? value.unwrap().active.unwrap()
      : null
};

const parseObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const stakeLimit = useCall<BN>(api.query.staking.stakeLimit, params);
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, params);
  const slashingSpans = useCall<SlashingSpans | null>(!isMain && api.query.staking.slashingSpans, params, transformSlashes);
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);
  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
  const erasStakersStashExposure = useCall<Exposure>(api.query.staking.erasStakers, [activeEra, address]);
  const accountIdBonded = useCall<string | null>(api.query.staking.bonded, params, transformBonded);
  const controllerActive = useCall<Balance | null>(api.query.staking.ledger, [accountIdBonded], transformLedger);
  const erasStakersStash = erasStakersStashExposure && (parseObj(erasStakersStashExposure).others.map((e: { who: any; }) => e.who));
  const nominators: NominatorValue[] = [{
    nominatorId: address,
    value: controllerActive as unknown as Balance
  }];

  const stakersGuarantees = useCall<Guarantee[]>(api.query.staking.guarantors.multi, [erasStakersStash]);
  let totalStaked = new BN(Number(controllerActive).toString());
  
  if (stakersGuarantees) {
    for (const index in stakersGuarantees) {
      if (parseObj(stakersGuarantees[index])) {
        for (const target of parseObj(stakersGuarantees[index])?.targets) {
          if (target.who.toString() == address) {
            totalStaked = totalStaked?.add(new BN(Number(target.value).toString()));
            nominators.push({
              nominatorId: erasStakersStash[index],
              value: api.createType('Balance', Number(target.value).toString())
            })
          }
        }
      }
    }
  }

  return { accountInfo, slashingSpans, totalStaked, stakeLimit, activeEra, nominators, controllerActive };
}

const UNIT = new BN(1_000_000_000_000);

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, lastBlock, validatorCount, totalReward, points, recentlyOnline, toggleFavorite, validatorInfo, withIdentity, totalEffectiveStake }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, stakeLimit, totalStaked, activeEra, nominators, controllerActive } = useAddressCalls(api, address, isMain);
  const [guarantorApy, setGuarantorApy] = useState<number>(0);
  const { guarantee_fee, stakeOwn, guarantee_fee_pref } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo)
      : { nominators: [] },
    [validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  useEffect(() => {
    if (activeEra && totalStaked && guarantee_fee_pref && totalReward && validatorCount && totalEffectiveStake) {
      const stakingReward = Number(totalReward.muln(0.8))
      const authringRewad = Number(totalReward.muln(0.2)) / validatorCount
      const guarantorStaked = UNIT;
      const rewardRate = Number(guarantorStaked) / (Number(totalStaked) * 1.0)
      const ownEffective = Math.min(Number(stakeLimit), Number(totalStaked))
      const guarantee_fee = guarantee_fee_pref == 1e-9 ? 0 : guarantee_fee_pref;
      const validatorRate = ( ownEffective / (Number(totalEffectiveStake) * 1.0));
      let apy = 0
      if (isMain) {
        apy = ownEffective ? rewardRate * ((stakingReward) * validatorRate + authringRewad) * 4 * guarantee_fee / 1000000000000 : 0
        setGuarantorApy(Math.pow((1 + apy), 365) - 1)
      } else {
        apy = ownEffective ? rewardRate * (stakingReward) * (validatorRate) * 4 * guarantee_fee / 1000000000000 : 0
        setGuarantorApy(Math.pow((1 + apy), 365) - 1)
      }
      validatorApy[address] = apy
    }

  }, [isMain, totalStaked, guarantee_fee_pref, activeEra, totalReward, validatorCount, totalEffectiveStake, stakeLimit, stakeOwn])

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${address}`;
    },
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <Status
          isElected={isElected}
          isMain={isMain}
          stakeLimit={new BN(Number(stakeLimit)?.toString())}
          totalStake={totalStaked}
          nominators={nominators}
          onlineCount={recentlyOnline?.blockCount}
          onlineMessage={recentlyOnline?.hasMessage}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number'>
        {stakeLimit && (
          <div style={{ display: "flex", "alignItems": "center" }}>
            <Icon
              icon='info-circle'
              tooltip={`summary-locks-trigger-set-fee-pool-${address}`}
            />
            <Tooltip
                text={(<ApyInfo apy={validatorApy[address]} />)}
                trigger={`summary-locks-trigger-set-fee-pool-${address}`}
            ></Tooltip> &nbsp;&nbsp; {(guarantorApy * 100).toFixed(2) + '%'}
          </div>
        )}
      </td>
      {<StakeOther
        nominators={nominators}
        stakeOther={totalStaked}
      />
      }
      {(
        <td className='number media--1100'>
          {(
            <FormatBalance value={controllerActive} />
          )}
        </td>
      )}
      <td className='number media--1100'>
        {stakeLimit && (
          <div>
            <FormatPw value={new BN(Number(stakeLimit)?.toString())} />
            {/* {formatBalance(new BN(Number(stakeLimit)?.toString()), { decimals: 12, withUnit: 'Pw' })} */}
          </div>
        )}
      </td>
      {/* <td className='number media--1100'>
        {totalStaked && (
          <div>
            <FormatBalance value={totalStaked} />
          </div>
        )}
      </td> */}
      <td className='number'>
        {guarantee_fee}
      </td>
      {isMain && (
        <>
          <td className='number'>
            {points}
          </td>
          <td className='number'>
            {lastBlock}
          </td>
        </>
      )}
      <td>
        {hasQueries && (
          <Icon
            className='highlight--color'
            icon='chart-line'
            onClick={_onQueryStats}
          />
        )}
      </td>
      <td className='links media--1200'>
        <LinkExternal
          data={address}
          isLogo
          type={isMain ? 'validator' : 'intention'}
        />
      </td>
    </tr>
  );
}

export default React.memo(Address);
