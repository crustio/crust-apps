// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import BN from 'bn.js';
import React, { useCallback, useMemo } from 'react';

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import { AddressSmall, Badge, Checkbox, Icon } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { UnappliedSlash, AccountId, Exposure, Balance, ActiveEraInfo, StakingLedger } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';

import MaxBadge from '../MaxBadge';
import Favorite from '../Overview/Address/Favorite';
import { useTranslation } from '../translate';
import { ValidatorInfo } from '../types';
import { Option } from '@polkadot/types';
import { Guarantee } from '../Actions/Account';

interface Props {
  allSlashes?: [BN, UnappliedSlash[]][];
  canSelect: boolean;
  filterName: string;
  info: ValidatorInfo;
  isNominated: boolean;
  isSelected: boolean;
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
  withElected: boolean;
  withIdentity: boolean;
}

// function checkIdentity (api: ApiPromise, accountInfo: DeriveAccountInfo): boolean {
//   let hasIdentity = false;
//
//   const { accountId, identity, nickname } = accountInfo;
//
//   if (api.query.identity && api.query.identity.identityOf) {
//     hasIdentity = !!(identity?.display && identity.display.toString());
//   } else if (nickname) {
//     hasIdentity = !!nickname.toString();
//   }
//
//   if (!hasIdentity && accountId) {
//     const account = keyring.getAddress(accountId.toString());
//
//     hasIdentity = !!account?.meta?.name;
//   }
//
//   return hasIdentity;
// }

const parseObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}

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

function Validator ({ allSlashes, canSelect, filterName, info, isNominated, isSelected, toggleFavorite, toggleSelected, withElected, withIdentity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [info.accountId]);
  const stakeLimit = useCall<BN>(api.query.staking.stakeLimit, [info.accountId]);

  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);

  const accountIdBonded = useCall<string | null>(api.query.staking.bonded, [info.accountId], transformBonded);
  const controllerActive = useCall<Balance | null>(api.query.staking.ledger, [accountIdBonded], transformLedger);
  const erasStakersStashExposure = useCall<Option<Exposure>>(api.query.staking.erasStakers, [activeEra, info.accountId]);
  const erasStakersStash = erasStakersStashExposure && (parseObj(erasStakersStashExposure).others.map((e: { who: any; }) => e.who))
  
  const stakersGuarantees = useCall<Guarantee[]>(api.query.staking.guarantors.multi, [erasStakersStash]);
  let totalStaked = new BN(Number(controllerActive).toString());
  if (stakersGuarantees) {
    for (const stakersGuarantee of stakersGuarantees) {
      if (parseObj(stakersGuarantee)) {
        for (const target of parseObj(stakersGuarantee)?.targets) {
          if (target.who.toString() == info.accountId?.toString()) {
            totalStaked = totalStaked?.add(new BN(Number(target.value).toString()))
          }
        }
      }
    }
  }

  // useEffect((): void => {
  //   if (accountInfo) {
  //     info.hasIdentity = checkIdentity(api, accountInfo);
  //   }
  // }, [api, accountInfo, info]);

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, info.key, accountInfo, filterName, withIdentity) : true,
    [accountInfo, api, filterName, info, withIdentity]
  );

  const slashes = useMemo(
    () => (allSlashes || [])
      .map(([era, all]) => ({ era, slashes: all.filter(({ validator }) => validator.eq(info.accountId)) }))
      .filter(({ slashes }) => slashes.length),
    [allSlashes, info]
  );

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${info.key}`;
    },
    [info.key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(info.key),
    [info.key, toggleSelected]
  );

  if (!isVisible || (withElected && !info.isElected)) {
    return null;
  }

  const { accountId, bondOther, bondOwn, bondTotal, commissionPer, isElected, isFavorite, key, numNominators, rankOverall } = info;

  return (
    <tr>
      <td className='badge together'>
        <Favorite
          address={key}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        {isNominated
          ? (
            <Badge
              color='green'
              icon='hand-paper'
            />
          )
          : <Badge color='transparent' />
        }
        {isElected
          ? (
            <Badge
              color='blue'
              icon='chevron-right'
            />
          )
          : <Badge color='transparent' />
        }
        <MaxBadge numNominators={numNominators} />
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t<string>('Slashed in era {{eras}}', {
              replace: {
                eras: slashes.map(({ era }) => formatNumber(era)).join(', ')
              }
            })}
            icon='skull-crossbones'
          />
        )}
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number media--1200'>{numNominators || ''}</td>
      <td className='number'>
        {`${commissionPer.toFixed(2)}%`}
      </td>
      <td className='number together'>{!bondTotal.isZero() && <FormatBalance value={bondTotal} />}</td>
      <td className='number together'>{!bondOwn.isZero() && <FormatBalance value={bondOwn} />}</td>
      <td className='number together media--1600'>{!bondOther.isZero() && <FormatBalance value={bondOther} />}</td>
      <td className='number together'>{stakeLimit && <FormatBalance value={new BN(Number(stakeLimit)?.toString())} />}</td>
      <td className='number together'>{totalStaked && <FormatBalance value={totalStaked} />}</td>
      <td>
        {(canSelect || isSelected) && (
          <Checkbox
            onChange={_toggleSelected}
            value={isSelected}
          />
        )}
      </td>
      <td>
        <Icon
          className='staking--stats'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
