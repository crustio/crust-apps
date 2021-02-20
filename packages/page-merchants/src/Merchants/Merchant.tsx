// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { AddressInfo, AddressSmall, Badge, Button, Icon, IdentityIcon, LinkExternal } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';
import { Delegation } from '@polkadot/app-accounts/types';
import AddCollateral from '../modals/AddCollateral';
import CutCollateral from '../modals/CutCollateral';

interface Props {
  account: KeyringAddress;
  className?: string;
  delegation?: Delegation;
  filter: string;
  isFavorite: boolean;
  proxy?: [ProxyDefinition[], BN];
  setBalance: (address: string, value: BN) => void;
  toggleFavorite: (address: string) => void;
}


function calcVisible (filter: string, name: string, tags: string[]): boolean {
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}


const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({ account: { address }, className = '', filter, isFavorite, proxy, setBalance, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const api = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all, [address]);
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const merchantLedger = useCall<any>(api.api.query.market.merchantLedgers, [address]);
  const pledge = merchantLedger && JSON.parse(JSON.stringify(merchantLedger))?.pledge;
  const reward = merchantLedger && JSON.parse(JSON.stringify(merchantLedger))?.reward;
  const { name: accName, tags } = useAccountInfo(address);
  const [isAddCollateralOpen, toggleAddCollateral] = useToggle();
  const [isCutCollateralOpen, toggleCutCollateral] = useToggle();

  useEffect((): void => {
    if (balancesAll) {
      setBalance(address, balancesAll.freeBalance.add(balancesAll.reservedBalance));
    }
  }, [address, api, balancesAll, setBalance]);

  const isVisible = useMemo(
    () => calcVisible(filter, accName, tags),
    [accName, filter, tags]
  );

  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      {isAddCollateralOpen && (
          <AddCollateral
            accountId={address}
            onClose={toggleAddCollateral}
          />
      )}
      {isCutCollateralOpen && (
          <CutCollateral
            accountId={address}
            onClose={toggleCutCollateral}
          />
      )}
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        {recoveryInfo && (
          <Badge
            color='green'
            hover={
              <div>
                <p>{t<string>('This account is recoverable, with the following friends:')}</p>
                <div>
                  {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                    <IdentityIcon
                      key={index}
                      value={friend}
                    />
                  ))}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>{t<string>('threshold')}</td>
                      <td>{formatNumber(recoveryInfo.threshold)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('delay')}</td>
                      <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                    </tr>
                    <tr>
                      <td>{t<string>('deposit')}</td>
                      <td>{formatBalance(recoveryInfo.deposit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            icon='shield'
          />
        )}
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>   
      <td className='number'>
        {formatBalance(reward)}
      </td>
      <td className='all'>
        {formatBalance(pledge)}
      </td>
      <td className='number'>
        <AddressInfo
          address={address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td></td>
      <td></td>
      <td className='button'>
        {api.api.tx.market?.pledgeExtra && (
          <Button
            icon='plus'
            label={t<string>('add collateral')}
            onClick={toggleAddCollateral}
          />
        )}
        {api.api.tx.market?.cutPledge && (
          <Button
            icon='cut'
            label={t<string>('cut collateral')}
            onClick={toggleCutCollateral}
          />
        )}
      </td>
      <td className='links media--1400'></td>
      <td className='links media--1400'>
        <LinkExternal
          className='ui--AddressCard-exporer-link'
          data={address}
          isLogo
          type='address'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }
`);
