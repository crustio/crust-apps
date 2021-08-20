// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { Compact } from '@polkadot/types';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Delegation } from '@polkadot/app-accounts/types';
import { useTranslation } from '@polkadot/apps/translate';
import { AddressSmall, Button, Icon, Menu, Popup, StatusContext, Tooltip } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import Bond from '../modals/Bond';
import { FoundsType } from '../modals/types';
import { FormatBalance } from '@polkadot/react-query';
import UnbondFounds from '../modals/UnbondFounds';
import RebondFounds from '../modals/RebondFounds';
import { formatBalance } from '@polkadot/util';
import UnLockingMarketFounds from './UnLockingMarketFounds';

interface Props {
  account: KeyringAddress;
  reductionQuota: BN;
  totalLockup: BN;
  className?: string;
  delegation?: Delegation;
  withCollateral?: boolean;
  filter: string;
  isFavorite: boolean;
  setBalance: (address: string, value: BN) => void;
  toggleFavorite: (address: string) => void;
}

function calcVisible (filter: string, name: string, tags: string[], marketLedger: any, withCollateral?: boolean): boolean {
  if (withCollateral) {
    if (!marketLedger || !marketLedger.active_funds ) {
      return false;
    }
    const collateral = marketLedger.active_funds as Compact<any>
    if (collateral.toBn().isZero()) {
      return false;
    }
  } 
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}

function Merchant ({ account: { address }, className = '', withCollateral, filter, isFavorite, setBalance, toggleFavorite, reductionQuota, totalLockup }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [address]);
  const marketLedger = useCall<any>(api.query.benefits.marketBenefits, [address]);
  const ledgerObj = marketLedger && JSON.parse(JSON.stringify(marketLedger));
  const { name: accName, tags } = useAccountInfo(address);
  const [isBondOpen, toggleBond] = useToggle();
  const [isUnBondOpen, toggleUnBond] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isReBondOpen, toggleReBond] = useToggle();
  const { queueExtrinsic } = useContext(StatusContext);
  const percentage = ledgerObj?.active_funds ? ((Math.min((ledgerObj?.active_funds / Number(totalLockup))), 0.1) * 100).toFixed(2) + '%' : `0.00 %`;
  const freeFunds = ((ledgerObj?.active_funds / Number(totalLockup)) * Number(reductionQuota));

  useEffect((): void => {
    if (balancesAll) {
      setBalance(address, balancesAll.freeBalance.add(balancesAll.reservedBalance));
    }
  }, [address, api, balancesAll, setBalance]);

  const isVisible = useMemo(
    () => calcVisible(filter, accName, tags, marketLedger, withCollateral),
    [accName, filter, tags, withCollateral, marketLedger]
  );

  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const withdrawFunds = useCallback(
    () => {
        queueExtrinsic({
            accountId: address,
            extrinsic: api.tx.benefits.withdrawBenefitFunds()
        });
    },
    [api, address, queueExtrinsic]
);

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      {isBondOpen && (
        <Bond
          accountId={address}
          onClose={toggleBond}
          foundsType={FoundsType.MARKET}
        />
      )}
      {isUnBondOpen && (
        <UnbondFounds
          accountId={address}
          foundsType={FoundsType.MARKET}
          onClose={toggleUnBond}
        />   
      )}
      {isReBondOpen && (
        <RebondFounds
          accountId={address}
          foundsType={FoundsType.MARKET}
          onClose={toggleReBond}
        />   
      )}
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number together'>
        <FormatBalance value={marketLedger?.active_funds} />
      </td>
      <td className='number together'>
        <UnLockingMarketFounds account={address} />
      </td>
      <td className='number together'>
        <FormatBalance value={marketLedger?.active_funds} />
      </td>
      <td className='number together'>
        <><Icon
            icon='info-circle'
            tooltip={`${address}-locks-trigger-set-guarantee-fee`}
        />

            <Tooltip
                className="wrap-text"
                text={t<string>('Discount Ratio = User collateral/Total collateral amount')}
                trigger={`${address}-locks-trigger-set-guarantee-fee`}
            ></Tooltip>
        </>&nbsp;&nbsp;{percentage}
      </td>
      <td className='number together'>
        <><Icon
            icon='info-circle'
            tooltip={`${address}-market-discount-trigge`}
        />

            <Tooltip
                text={t<string>('Free funds = (User collateral /Total collateral amount) * Settlement transaction fee relief pool')}
                trigger={`${address}-market-discount-trigge`}
            ></Tooltip>
        </>&nbsp;&nbsp;{formatBalance(freeFunds, {withSiFull: true})}
      </td>  
      <td className='button'>
        {api.tx.benefits?.addBenefitFunds && (
          <Button
            icon='lock'
            label={t<string>('Increase Collateral')}
            onClick={toggleBond}
          />
        )}
        {api.tx.benefits?.cutBenefitFunds && (
          <Button
            icon='unlock'
            label={t<string>('Decrease Collateral')}
            onClick={toggleUnBond}
          />
        )}
        <Popup
            isOpen={isSettingsOpen}
            key='settings'
            onClose={toggleSettings}
            trigger={
                <Button
                    icon='ellipsis-v'
                    onClick={toggleSettings}
                />
            }
        >
            <Menu
                onClick={toggleSettings}
                text
                vertical
            >
                <Menu.Item onClick={toggleReBond}>
                    {t<string>('Rebond')}
                </Menu.Item>
                <Menu.Item onClick={withdrawFunds}>
                    {t<string>('Withdraw unbonded funds')}
                </Menu.Item>
            </Menu>
        </Popup>
      </td>
    </tr>
  );
}

export default React.memo(styled(Merchant)`
  .tags {
    width: 100%;
    min-height: 1.5rem;
  }

`);
