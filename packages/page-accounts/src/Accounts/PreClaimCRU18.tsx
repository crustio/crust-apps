// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { KeyringItemType } from '@polkadot/ui-keyring/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Icon, Tooltip } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import lodash from 'lodash';
import { BN_ZERO, formatBalance, u8aConcat, u8aToHex } from '@polkadot/util';
import { FormatCru18 } from '@polkadot/react-query';

interface Props {
  totalStake?: BN | BN[];
  effectiveStake?: BN | BN[];
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

interface PreClaimsMapping {
  account: AccountId,
  ethAddress: string,
  value: BN
}

function PreClaimCRU18 ({ className = '', isHighlight, isPadded = true, value, withShrink = false }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [preClaims, setPreClaims] = useState<PreClaimsMapping[]>([]);
  const [ownPreClaims, setOwnPreClaims ] = useState<PreClaimsMapping[]>([]);

  const [preValue, setPreValue] = useState<BN>(BN_ZERO);

  const getAllPreClaims = () => {
    let unsub: (() => void) | undefined;
    const fns: any[] = [
      [api.query.claims.cru18Claims.entries]
    ];
    const tmp: PreClaimsMapping[] = [];

    api.combineLatest<any[]>(fns, ([preClaims]): void => {
      if (Array.isArray(preClaims)) {
        preClaims.forEach(([{ args: [ethereumAddress, accountId] }, value]) => {
          tmp.push({
            account: accountId,
            ethAddress: u8aToHex(u8aConcat(ethereumAddress), 48).toString(),
            value: new BN(Number(value).toString())
          })
        });
        setPreClaims(tmp);
      }
    }).then((_unsub): void => {
      unsub = _unsub;
    }).catch(console.error);
    return (): void => {
      unsub && unsub();
    };
  };

  useEffect(() => {
    getAllPreClaims();
  }, []);

  useEffect(() => {
    if (preClaims.length) {
      const claimTmp = lodash.filter(preClaims, e => e.account.toString() == value?.toString());

      setOwnPreClaims(claimTmp);
      setPreValue(lodash.reduce(claimTmp, (sum, n) => {
        return sum.add(n.value)
      }, BN_ZERO))
    }
  }, [preClaims])

  if (preValue.isZero()) {
    return null;
  }

  return (
    <div className={`ui--AddressMini${isHighlight ? ' isHighlight' : ''}${isPadded ? ' padded' : ''}${withShrink ? ' withShrink' : ''} ${className}`}>
      <div className='ui--AddressMini-balances'>
        <React.Fragment key={3}>
          <FormatCru18
            className='result'
            label={
              <Icon
                icon='info-circle'
                tooltip={`${value}-locks-trigger`}
              />
            }
            value={new BN(Number(preValue).toString())}
          >
            <Tooltip
              text={ownPreClaims.map(({ ethAddress, value }, index): React.ReactNode => (
                <div key={index}>
                  {formatBalance(value, { forceUnit: '-', withUnit: 'CRU18' })
                  }<div className='faded'>{ethAddress.toString()}</div>
                </div>
              ))}
              trigger={`${value}-locks-trigger`}
            />
          </FormatCru18>
        </React.Fragment>
      </div>
    </div>
  );
}

export default React.memo(styled(PreClaimCRU18)`
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
  .result {
    grid-column: 2;

    .icon {
      margin-left: 0;
      margin-right: 0.25rem;
      padding-right: 0 !important;
    }
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
