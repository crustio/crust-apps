// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { UnappliedSlash } from '@polkadot/types/interfaces';
import type { NominatedBy, ValidatorInfo } from '../types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressSmall, Badge, Checkbox, Icon, Tooltip } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useBlockTime, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import MaxBadge from '../MaxBadge';
import Favorite from '../Overview/Address/Favorite';
import { useTranslation } from '../translate';
import ApyInfo from '../Overview/Address/ApyInfo';

interface Props {
  allSlashes?: [BN, UnappliedSlash[]][];
  canSelect: boolean;
  filterName: string;
  info: ValidatorInfo;
  isNominated: boolean;
  isSelected: boolean;
  nominatedBy?: NominatedBy[];
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
}

function queryAddress (address: string): void {
  window.location.hash = `/staking/query/${address}`;
}

function Validator ({ allSlashes, canSelect, filterName, info, isNominated, isSelected, nominatedBy = [], toggleFavorite, toggleSelected }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [info.accountId]);
  const [,, time] = useBlockTime(info.lastPayout);
  const [guarantorApy, setGuarantorApy] = useState<number>(0);

  const isOverStakelimit = info.totalStaked.gt(new BN(Number(info.stakeLimit)?.toString()));

  const isVisible = useMemo(
    () => accountInfo
      ? checkVisibility(api, info.key, accountInfo, filterName)
      : true,
    [accountInfo, api, filterName, info]
  );

  const slashes = useMemo(
    () => (allSlashes || [])
      .map(([era, all]) => ({ era, slashes: all.filter(({ validator }) => validator.eq(info.accountId)) }))
      .filter(({ slashes }) => slashes.length),
    [allSlashes, info]
  );

  const _onQueryStats = useCallback(
    () => queryAddress(info.key),
    [info.key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(info.key),
    [info.key, toggleSelected]
  );

  useEffect(() => {
    if (info) {
      setGuarantorApy(Math.pow((1 + info.apy), 365) - 1)
    }
  }, [info])

  if (!isVisible) {
    return null;
  }

  const { accountId, commissionPer, isElected, isFavorite, key, lastPayout, numNominators, rankOverall } = info;

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
        <MaxBadge numNominators={numNominators || nominatedBy.length} />
        {/* {isBlocking && (
          <Badge
            color='red'
            icon='user-slash'
          />
        )} */}
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
        {isOverStakelimit && (
          <Badge
            color='red'
            icon='balance-scale-right'
          />
        )}
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number media--1400'>
        {lastPayout && (
          api.consts.babe
            ? time.days
              ? time.days === 1
                ? t('yesterday')
                : t('{{days}} days', { replace: { days: time.days } })
              : t('recently')
            : formatNumber(lastPayout)
        )}
      </td>
      
      <td className='number media--1200 no-pad-right'>{numNominators || ''}</td>
      <td className='number media--1200 no-pad-left'>{nominatedBy.length || ''}</td>
      <td className='number media--1100'>{commissionPer.toFixed(2)}%</td>
      <td className='number'>
        {info && (
          <div style={{ display: "flex", "alignItems": "center" }}>
            <Icon
              icon='info-circle'
              tooltip={`summary-locks-trigger-set-fee-pool-${info.accountId}`}
            />
            <Tooltip
                text={(<ApyInfo apy={info.apy} />)}
                trigger={`summary-locks-trigger-set-fee-pool-${info.accountId}`}
            ></Tooltip> &nbsp;&nbsp; {(guarantorApy * 100).toFixed(2) + '%'}
          </div>
        )}
      </td>
      <td className='number together'>{info.totalStaked && <FormatBalance value={info.totalStaked} />}</td>
      <td className='number together'>{info.stakeLimit && <FormatBalance value={new BN(Number(info.stakeLimit)?.toString())} />}</td>
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
          className='staking--stats highlight--color'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
