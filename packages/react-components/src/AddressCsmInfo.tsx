// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveBalancesAll, DeriveDemocracyLock, DeriveStakingAccount } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { withMulti } from '@polkadot/react-api/hoc';
import { Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Label from './Label';
import { useTranslation } from './translate';
import { FormatCsmBalance } from '@polkadot/react-query';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
    available?: boolean;
    bonded?: boolean | BN[];
    extraInfo?: [React.ReactNode, React.ReactNode][];
    locked?: boolean;
    redeemable?: boolean;
    reserved?: boolean;
    total?: boolean;
    unlocking?: boolean;
    vested?: boolean;
}

export interface CryptoActiveType {
    crypto?: boolean;
    nonce?: boolean;
}

export interface ValidatorPrefsType {
    unstakeThreshold?: boolean;
    validatorPayment?: boolean;
}

interface Props {
    address: string;
    balancesAll?: DeriveBalancesAll;
    children?: React.ReactNode;
    className?: string;
    democracyLocks?: DeriveDemocracyLock[];
    extraInfo?: [string, string][];
    stakingInfo?: DeriveStakingAccount;
    withBalance?: boolean | BalanceActiveType;
    withBalanceToggle?: false;
    withExtended?: boolean | CryptoActiveType;
    withHexSessionId?: (string | null)[];
    withValidatorPrefs?: boolean | ValidatorPrefsType;
    withoutLabel?: boolean;
}

function AddressCsmInfo(props: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [csm, setCsm] = useState<any>(null);
    const csmBalances = useCall<any>(api.query.csm.account, [props.address])
    const { className = '', withBalanceToggle } = props;
    const [allItems, setAllItems] = useState<React.ReactNode[]>([]);
    useEffect(() => {
        if (csmBalances && JSON.parse(JSON.stringify(csmBalances))) {
            setCsm(JSON.parse(JSON.stringify(csmBalances)))
        }
    }, [csmBalances]);

    useEffect(() => {
        if (csm) {
            const tmp = [
                <React.Fragment key={0}>
                    <Label label={t<string>('total')} />
                    <FormatCsmBalance className='result' value={new BN(Number(csm.free).toString()).add(new BN(Number(csm.reserved).toString()))} >
                    </FormatCsmBalance>
                </React.Fragment>,
                <React.Fragment key={1}>
                    <Label label={t<string>('free')} />
                    <FormatCsmBalance className='result' value={new BN(Number(csm.free).toString()).sub(new BN(Number(csm.miscFrozen).toString()))}>
                    </FormatCsmBalance>
                </React.Fragment>,
                // <React.Fragment key={2}>
                //     <Label label={t<string>('reserved')} />
                //     <FormatCsmBalance className='result' value={new BN(Number(csm.reserved).toString())}>
                //     </FormatCsmBalance>
                // </React.Fragment>,
                <React.Fragment key={3}>
                    <Label label={t<string>('miscFrozen')} />
                    <FormatCsmBalance className='result' value={new BN(Number(csm.miscFrozen).toString())}>
                    </FormatCsmBalance>                
                </React.Fragment>
            ];
            setAllItems(tmp)
        }
    }, [csm])


    return csm && (
        <div className={`ui--AddressInfo${className}${withBalanceToggle ? ' ui--AddressInfo-expander' : ''}`}>
            <div className={`column${withBalanceToggle ? ' column--expander' : ''}`}>
                <React.Fragment>
                    <Expander summary={
                        <FormatCsmBalance value={new BN(Number(csm.free).toString()).add(new BN(Number(csm.reserved).toString()))}>  
                        </FormatCsmBalance>
                    }>
                        {allItems.length !== 0 && (
                            <div className='body column'>
                                {allItems}
                            </div>
                        )}
                    </Expander>
                    
                </React.Fragment>
            </div>
        </div>
    );
}

export default withMulti(
    styled(AddressCsmInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    white-space: nowrap;

    &:not(.ui--AddressInfo-expander) {
      justify-content: center;
    }

    .column {
      justify-content: start;

      &.column--expander {
        width: 17.5rem;

        .ui--Expander {
          width: 100%;

          .summary {
            display: inline-block;
            text-align: right;
            min-width: 12rem;
          }
        }
      }

      &:not(.column--expander) {
        flex: 1;
        display: grid;
        opacity: 1;

        label {
          grid-column: 1;
          padding-right: 0.5rem;
          text-align: right;
          vertical-align: middle;

          .help.circle.icon {
            display: none;
          }
        }

        .result {
          grid-column: 2;

          .icon {
            margin-left: 0;
            margin-right: 0.25rem;
            padding-right: 0 !important;
          }
        }
      }
    }
  `
);
