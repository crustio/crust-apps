// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { AccountName, Badge, IdentityIcon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  frozenBn: number;
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  withSidebar?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressStatusSmall ({ children, className = '', defaultName, frozenBn, onClickName, overrideName, toggle, value, withSidebar = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(api.derive.chain.bestNumberFinalized);

  return (
    <div className={`ui--AddressSmall ${className}`}>
      {(frozenBn && frozenBn > Number(bestNumberFinalized))
        ? (
          <Badge color='orange'
            hover={t<string>('You can not set guarantee fee until block {{bn}}', {
              replace: {
                bn: frozenBn
              }
            })}
            icon='ice-cream'
          />
        )
        : null}
      <IdentityIcon value={value as Uint8Array} />
      <AccountName
        className={withSidebar ? 'withSidebar' : ''}
        defaultName={defaultName}
        onClick={onClickName}
        override={overrideName}
        toggle={toggle}
        value={value}
        withSidebar={withSidebar}
      >
        {children}
      </AccountName>
    </div>
  );
}

export default React.memo(styled(AddressStatusSmall)`
  white-space: nowrap;

  .ui--IdentityIcon {
    margin-right: 0.75rem;
    vertical-align: middle;
  }

  .ui--AccountName {
    max-width: 26rem;
    overflow: hidden;

    &.withSidebar {
      cursor: help;
    }

    @media only screen and (max-width: 1700px) {
      max-width: 24rem;
    }

    @media only screen and (max-width: 1600px) {
      max-width: 22rem;
    }

    @media only screen and (max-width: 1500px) {
      max-width: 20rem;
    }

    @media only screen and (max-width: 1400px) {
      max-width: 18rem;
    }

    @media only screen and (max-width: 1300px) {
      max-width: 16rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 14rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 12rem;
    }
  }
`);
