// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, ValidatorPrefs } from '@polkadot/types/interfaces';
import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ValidatorInfo } from '../../types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatCapacity } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

import Favorite from './Favorite';
import Status from './Status';
import { formatBalance } from '@polkadot/util';

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

interface WorkReport extends Codec {
  block_number: 'u64',
  used: 'u64',
  reserved: 'u64',
  cached_reserved: 'u64',
  files: 'Vec<(Vec<u8>, u64)>'
}

interface MerchantInfo extends Codec {
  address: 'Vec<u8>',
  storage_price: 'Balance',
  file_map: 'Vec<(Vec<u8>, Vec<Hash>)>'
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

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, params);

  const workReport = useCall<Option<WorkReport>>(api.query.swork.workReports, params);
  const merchantInfo = useCall<Option<MerchantInfo>>(api.query.market.merchants, params);

  return { accountInfo, workReport, merchantInfo };
}

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, lastBlock, nominatedBy, onlineCount, onlineMessage, points, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, workReport, merchantInfo } = useAddressCalls(api, address, isMain);

  const { commission, nominators } = useMemo(
    () => validatorInfo ? expandInfo(validatorInfo) : { nominators: [] },
    [validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  if (!isVisible) {
    return null;
  }

  if (workReport && JSON.stringify(workReport) === 'null') {
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
        {/* <Status
          isElected={isElected}
          isMain={isMain}
          nominators={nominators}
          onlineCount={onlineCount}
          onlineMessage={onlineMessage}
        /> */}
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {/* {isMain
        ? (
          <StakeOther
            nominators={nominators}
            stakeOther={stakeOther}
          />
        )
        : (
          <NominatedBy
            nominators={nominatedBy}
            slashingSpans={slashingSpans}
          />
        )
      } */}
      <td className='number media--1100'>
        {workReport && JSON.stringify(workReport) !== 'null' && (
          <FormatCapacity value={workReport.unwrap().reserved} />
        )}
      </td>
      <td className='number media--1100'>
        {merchantInfo && (
          // <FormatBalance value={merchantInfo.unwrap().storage_price} />
          formatBalance(merchantInfo.unwrap().storage_price)
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
