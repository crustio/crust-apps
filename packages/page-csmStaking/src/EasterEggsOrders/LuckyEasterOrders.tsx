// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { AddressMini } from '@polkadot/react-components';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { FormatCapacity } from '@polkadot/react-query';
import { LuckyOrder } from '../Overview/types';

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: LuckyOrder;
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

function LuckyEasterOrders({ className = '', info: { size, cid, topFour } }: Props): React.ReactElement<Props> | null {

    return (
        <tr className={className}>
            <td className='start'>
                {cid}           
            </td>
            <td className='number'>
                <FormatCapacity value={Number(size)} />
            </td>
            {/* <td className='number'>
                {topFour.length !== 0 && (
                <Expander summary={
                    <>
                    <div>{t<string>('Collectors')}</div>
                    </>
                }>
                    {topFour.map((address) => (
                    <AddressMini
                        key={address.toString()}
                        value={address}
                    />
                    ))}
                </Expander>
                )} 
                <AddressMini
                    key={topFour[0].toString()}
                    value={topFour[0]}
                />
            </td> */}
            {topFour.length !== 0 && (topFour.map((address) =>  {
                return <td className='address' key={address.toString()}> 
                    <AddressMini
                        key={address.toString()}
                        value={address}
                    />
                </td>
            }))}    
        </tr>
    );
}

export default React.memo(styled(LuckyEasterOrders)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
