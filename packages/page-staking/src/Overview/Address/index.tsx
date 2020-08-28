// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, EraIndex, SlashingSpans, Exposure } from '@polkadot/types/interfaces';
import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { Compact } from '@polkadot/types/codec';

import BN from 'bn.js';
import React, { useCallback, useMemo, useEffect } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
import Status from './Status';
import StakeOther from './StakeOther';

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
  onlineCount?: false | number;
  onlineMessage?: boolean;
  points?: string;
  toggleFavorite: (accountId: string) => void;
  withIdentity: boolean;
  setNominators?: false | ((nominators: string[]) => void);
}

interface StakingState {
  commission?: string;
  nominators: [string, Balance][];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
  stakeLimit?: BN;
}

interface ValidatorPrefs {
  fee: Compact<Balance>
}

const PERBILL_PERCENT = 10_000_000;

function expandInfo (exposure: Exposure, validatorPref: ValidatorPrefs, stakeLimit: BN): StakingState {
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

  const commission = validatorPref?.fee?.unwrap();
  return {
    commission: commission
      ? `${(commission.toNumber() / PERBILL_PERCENT).toFixed(2)}%`
      : undefined,
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal,
    stakeLimit: new BN(stakeLimit.toString())
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, params);
  const slashingSpans = useCall<SlashingSpans | null>(!isMain && api.query.staking.slashingSpans, params, transformSlashes);
  const validatorsRel = useCall<ValidatorPrefs>(api.query.staking.validators, [address]);
  // const stakingInfo = useCall<DeriveStakingQuery>(api.derive.staking.query, params);
  const currentEra =  useCall<EraIndex>(api.query.staking.currentEra);
  const stakingInfo = useCall<Exposure>(api.query.staking.erasStakers, [currentEra?.toHuman(), address]);
  const _stakeLimit = useCall<BN>(api.query.staking.stakeLimit, params);

  return { accountInfo, slashingSpans, stakingInfo, validatorsRel, _stakeLimit };
}

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, lastBlock, nominatedBy, onlineCount, onlineMessage, points, toggleFavorite, withIdentity, setNominators }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, slashingSpans, stakingInfo, validatorsRel, _stakeLimit } = useAddressCalls(api, address, isMain);

  const { commission, nominators, stakeOther, stakeOwn, stakeLimit } = useMemo(
    () => stakingInfo && _stakeLimit && validatorsRel ? expandInfo(stakingInfo, validatorsRel, _stakeLimit) : { nominators: [] },
    [stakingInfo, _stakeLimit]
  );

  useEffect((): void => {
    stakingInfo && setNominators && setNominators(stakingInfo.others.map((guarantor): string => guarantor.who.toString()));
  }, [setNominators, stakingInfo, validatorsRel]);

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
          numNominators={nominatedBy?.length}
          onlineCount={onlineCount}
          onlineMessage={onlineMessage}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {isMain
        ? (
          <StakeOther
            nominators={nominators}
            stakeOther={stakeOther}
          />
        )
        : (
          <NominatedBy
            nominators={nominatedBy}
            // slashingSpans={slashingSpans}
          />
        )
      }
      <td className='number media--1100'>
        {(
          <FormatBalance value={stakeOwn} />
        )}
      </td>
      <td className='number media--1100'>
        {(
          <FormatBalance value={stakeLimit} />
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
      <td className='mini media--1200'>
        <LinkExternal
          data={address}
          type={isMain ? 'validator' : 'intention'}
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(Address);
