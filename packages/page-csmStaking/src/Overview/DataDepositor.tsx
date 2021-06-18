// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { useTranslation } from '@polkadot/apps/translate';
import { DataDepositorState } from './types';
import { checkVisibility } from '@polkadot/react-components/util';


interface Props {
    className?: string;
    isDisabled?: boolean;
    info: DataDepositorState;
    filterName: string;
    withIdentity: boolean;
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

function DataDepositor({ className = '', filterName, withIdentity, info: { accountId, storageData, csmLimit, totalStake, guaranteeFee } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const { api } = useApi();
    const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [accountId]);
    const isVisible = useMemo(
        () => accountInfo ? checkVisibility(api, accountId, accountInfo, filterName, withIdentity) : true,
        [api, accountId, filterName, withIdentity]
    );

    if (!isVisible) {
        return null;
    }

    return (
        <tr className={className}>
            <td className='address'>
                <AddressSmall value={accountId} />
            </td>
            <td className='number'>
                {storageData}
            </td>
            <td className='number'>
                {csmLimit}
            </td>
            <td className='number'>
                {totalStake}
            </td>
            <td className='number'>
                {guaranteeFee}
            </td>
        </tr>
    );
}

export default React.memo(styled(DataDepositor)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
