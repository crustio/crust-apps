// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Expander, Table } from '@polkadot/react-components';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { EasterEggsOrder } from '../Overview/types';
import { useTranslation } from '@polkadot/apps/translate';
import LuckyEasterOrders from './LuckyEasterOrders';
const dateFormat = require('dateformat');

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: EasterEggsOrder;
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

function PreviousOrders({ className = '', info: { date, orders } }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();

    const headerRef = useRef([
        [t('cid'), 'start'],
        [t('size')],
        [t('merchant-1'), 'start'],
        [t('merchant-2'), 'start'],
        [t('merchant-3'), 'start'],
        [t('merchant-4'), 'start']
    ]);

    return (
        <tr className={className}>
            <td className='start'>
                {dateFormat(date, "yyyy-mm-dd")}           
            </td>
            <td className='expand'>
                {orders.length !== 0 && (
                <Expander summary={
                    <>
                    <div>{t<string>('Orders')}</div>
                    </>
                }>
                    
                    <>
                        <Table
                            header={headerRef.current}
                            >
                                {orders?.map((info): React.ReactNode => (
                                    <LuckyEasterOrders
                                        key={info.cid}
                                        info={info}
                                    />
                                ))}

                        </Table>
                    </>
                   
                </Expander>
                )}
            </td>
        </tr>
    );
}

export default React.memo(styled(PreviousOrders)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
