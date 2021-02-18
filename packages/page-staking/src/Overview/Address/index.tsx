// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { Balance, SlashingSpans, ValidatorPrefs, AccountId, StakingLedger, ActiveEraInfo, Exposure } from '@polkadot/types/interfaces';
import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ValidatorInfo } from '../../types';

import BN from 'bn.js';
import React, { useCallback, useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import Favorite from './Favorite';
import Status from './Status';
import StakeOther from './StakeOther';
import { Guarantee } from '@polkadot/app-staking/Actions/Account';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  lastBlock?: string;
  nominatedBy?: [string, number][];
  onlineCount?: false | BN;
  onlineMessage?: boolean;
  points?: string;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity: boolean;
}

interface StakingState {
  commission?: string;
  nominators: [string, Balance][];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo): StakingState {
  let nominators: [string, Balance][] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure) {
    nominators = exposure.others.map(({ value, who }): [string, Balance] => [who.toString(), value.unwrap()]);
    stakeTotal = exposure.total.unwrap();
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  const commission = (validatorPrefs as ValidatorPrefs)?.commission?.unwrap();

  return {
    commission: commission?.toHuman(),
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
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
}

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, params);
  const slashingSpans = useCall<SlashingSpans | null>(!isMain && api.query.staking.slashingSpans, params, transformSlashes);
  const stakeLimit = useCall<BN>(api.query.staking.stakeLimit, params);
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);
  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);

  const accountIdBonded = useCall<string | null>(api.query.staking.bonded, params, transformBonded);
  const controllerActive = useCall<Balance | null>(api.query.staking.ledger, [accountIdBonded], transformLedger);
  const erasStakersStashExposure = useCall<Option<Exposure>>(api.query.staking.erasStakers, [activeEra, address]);
  const erasStakersStash = erasStakersStashExposure && (parseObj(erasStakersStashExposure).others.map((e: { who: any; }) => e.who))
  
  const stakersGuarantees = useCall<Guarantee[]>(api.query.staking.guarantors.multi, [erasStakersStash]);
  let totalStaked = new BN(Number(controllerActive).toString());
  if (stakersGuarantees) {
    for (const stakersGuarantee of stakersGuarantees) {
      if (parseObj(stakersGuarantee)) {
        for (const target of parseObj(stakersGuarantee)?.targets) {
          if (target.who.toString() == address) {
            totalStaked = totalStaked?.add(new BN(Number(target.value).toString()))
          }
        }
      }
    }
  }

  return { accountInfo, slashingSpans, stakeLimit, totalStaked };
}

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, lastBlock, onlineCount, onlineMessage, points, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, stakeLimit, totalStaked } = useAddressCalls(api, address, isMain);

  const { commission, nominators, stakeOther, stakeOwn } = useMemo(
    () => validatorInfo ? expandInfo(validatorInfo) : { nominators: [] },
    [validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

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
          nominators={nominators}
          onlineCount={onlineCount}
          onlineMessage={onlineMessage}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {(
        <StakeOther
          nominators={nominators}
          stakeOther={stakeOther}
        />
      )}
      <td className='number media--1100'>
        {(
          <FormatBalance value={stakeOwn} />
        )}
      </td>
      <td className='number media--1100'>
        {stakeLimit && (
          <div> 
            <FormatBalance value={new BN(Number(stakeLimit)?.toString())} /> 
          </div>
          // <>
          //   <Label label={t<string>('stake limit')} />
          //     <FormatBalance
          //       className='result'
          //       value={new BN(Number(stakeLimit)?.toString())}
          //   />

          //   <Label label={t<string>('total stakes')} />
          //     <FormatBalance
          //       className='result'
          //       value={totalStaked}
          //   />
          // </>
        )}
      </td>
      <td className='number media--1100'>
        {totalStaked && (
          <div> 
            <FormatBalance value={totalStaked} />
          </div>
        )}
      </td>
      <td className='number'>
        {commission}
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
