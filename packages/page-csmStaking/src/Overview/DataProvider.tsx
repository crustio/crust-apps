// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { DataProviderState } from './types';
import { checkVisibility } from '@polkadot/react-components/util';
import { FormatDataPower, FormatCsmBalance } from '@polkadot/react-query';
import BN from 'bn.js';
import Favorite from '@polkadot/app-staking/Overview/Address/Favorite';

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: DataProviderState;
    filterName: string;
    withIdentity: boolean;
    isFavorite: boolean;
    toggleFavorite: (address: string) => void;
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

const UNIT = new BN(1_000_000_000_000);

const Capacity_Unit = new BN(1048576);

function DataProvider({ className = '', isFavorite, toggleFavorite, filterName, withIdentity, info: { account, storage, csmLimit, stakedCSM, guaranteeFee, effectiveCSM } }: Props): React.ReactElement<Props> | null {
    const { api } = useApi();
    const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [account]);
    const isVisible = useMemo(
        () => accountInfo ? checkVisibility(api, account, accountInfo, filterName, withIdentity) : true,
        [api, account, filterName, withIdentity]
    );
    
    
    const _onFavorite = useCallback(
        () => toggleFavorite(account),
        [account, toggleFavorite]
    );
    
    if (!isVisible) {
        return null;
    }

    return (
        <tr className={className}>
            <td className='badge together'>
                <Favorite
                    address={account}
                    isFavorite={isFavorite}
                    toggleFavorite={_onFavorite}
                />
            </td>
            <td className='address'>
                <AddressSmall value={account} />
            </td>
            <td className='number'>
                <FormatDataPower value={Number(Capacity_Unit.muln(storage))} />
            </td>
            <td className='number'>
                <FormatCsmBalance value={UNIT.muln(csmLimit)}/>
            </td>
            <td className='number'>
                <FormatCsmBalance value={UNIT.muln(effectiveCSM)}/>
            </td>
            <td className='number'>
                <FormatCsmBalance value={UNIT.muln(stakedCSM)}/>
            </td>
            <td className='number'>
                {(guaranteeFee * 100).toFixed(0) + "%"}
            </td>
        </tr>
    );
}

export default React.memo(styled(DataProvider)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
