// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { KeyringItemType } from '@polkadot/ui-keyring/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { AccountName, Icon, IdentityIcon, Label } from '@polkadot/react-components';
import { toShortAddress } from '@polkadot/react-components/util';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  totalStake?: BN | BN[];
  effectiveStake?: BN;
  children?: React.ReactNode;
  className?: string;
  iconInfo?: React.ReactNode;
  isHighlight?: boolean;
  isPadded?: boolean;
  isShort?: boolean;
  label?: React.ReactNode;
  labelBalance?: React.ReactNode;
  summary?: React.ReactNode;
  type?: KeyringItemType;
  value?: AccountId | AccountIndex | Address | string | null | Uint8Array;
  withAddress?: boolean;
  withBalance?: boolean;
  withBonded?: boolean;
  withLockedVote?: boolean;
  withSidebar?: boolean;
  withName?: boolean;
  withShrink?: boolean;
}

function AddressMiniForEffectiveStake ({ children, className = '', effectiveStake, iconInfo, isHighlight, isPadded = true, label, totalStake, value, withAddress = true, withName = true, withShrink = false, withSidebar = true }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!value) {
    return null;
  }

  return (
    <div className={`ui--AddressMini${isHighlight ? ' isHighlight' : ''}${isPadded ? ' padded' : ''}${withShrink ? ' withShrink' : ''} ${className}`}>
      {label && (
        <label className='ui--AddressMini-label'>{label}</label>
      )}
      <div className='ui--AddressMini-icon'>
        <IdentityIcon value={value as Uint8Array} />
        {iconInfo && (
          <div className='ui--AddressMini-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
      <div className='ui--AddressMini-info'>
        {withAddress && (
          <div className='ui--AddressMini-address'>
            {withName
              ? (
                <AccountName
                  value={value}
                  withSidebar={withSidebar}
                />
              )
              : toShortAddress(value)
            }
          </div>
        )}
        {children}
      </div>
      <div className='ui--AddressMini-balances'>
        <Label label={t<string>('total stake')} />
        <FormatBalance value={totalStake}>

            &nbsp;{ (effectiveStake === null || (effectiveStake && effectiveStake.lten(0))) && <Icon color='red'
            icon='info-circle'
            tooltip={'mainnet-reward-trigger'} /> }
        </FormatBalance>
        {/* <Label label={t<string>('effective stake')} /><FormatBalance value={effectiveStake}></FormatBalance> */}
      </div>
    </div>
  );
}

export default React.memo(styled(AddressMiniForEffectiveStake)`
  display: inline-block;
  padding: 0 0.25rem 0 1rem;
  text-align: left;
  white-space: nowrap;

  &.padded {
    display: inline-block;
    padding: 0 1rem 0 0;
  }

  &.summary {
    position: relative;
    top: -0.2rem;
  }

  .ui--AddressMini-info {
    max-width: 12rem;
    min-width: 12rem;

    @media only screen and (max-width: 1800px) {
      max-width: 11.5rem;
      min-width: 11.5rem;
    }

    @media only screen and (max-width: 1700px) {
      max-width: 11rem;
      min-width: 11rem;
    }

    @media only screen and (max-width: 1600px) {
      max-width: 10.5rem;
      min-width: 10.5rem;
    }

    @media only screen and (max-width: 1500px) {
      max-width: 10rem;
      min-width: 10rem;
    }

    @media only screen and (max-width: 1400px) {
      max-width: 9.5rem;
      min-width: 9.5rem;
    }

    @media only screen and (max-width: 1300px) {
      max-width: 9rem;
      min-width: 9rem;
    }
  }

  .ui--AddressMini-address {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    width: fit-content;
    max-width: inherit;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &.withShrink {
    .ui--AddressMini-address {
      min-width: 3rem;
    }
  }

  .ui--AddressMini-label {
    margin: 0 0 -0.5rem 2.25rem;
  }

  .ui--AddressMini-balances {
    display: grid;

    .ui--Balance,
    .ui--Bonded,
    .ui--LockedVote {
      font-size: 0.75rem;
      margin-left: 2.25rem;
      margin-top: -0.5rem;
      text-align: left;
    }
  }

  .ui--AddressMini-icon {
    margin: 0 0.5rem 0 0;

    .ui--AddressMini-icon-info {
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      z-index: 1;
    }

    .ui--IdentityIcon {
      margin: 0;
      vertical-align: middle;
    }
  }

  .ui--AddressMini-icon,
  .ui--AddressMini-info {
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }

  .ui--AddressMini-summary {
    font-size: 0.75rem;
    line-height: 1.2;
    margin-left: 2.25rem;
    margin-top: -0.2rem;
    text-align: left;
  }
`);
