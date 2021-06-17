// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { ActiveEraInfo, Balance, IndividualExposure, SlashingSpans, UnappliedSlash, ValidatorId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, StatusContext, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { BN_ZERO, formatNumber, isFunction } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';
import { StakerState } from './partials/types';
import Guarantee from './Guarantee';
import GuaranteePref from './GuaranteePref';


interface Props {
    className?: string;
    isDisabled?: boolean;
    info: StakerState;
    miners: any[];
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

function Account({ className = '', info: { accountId, effectiveCsm, totalReward, predictCsm }, isDisabled, miners }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    console.log('miners', miners)
    const [isSetPrefOpen, toggleSetPref] = useToggle();
    const [isGuaranteeOpen, toggleGuarantee] = useToggle();

    const [role, setRole] = useState<string>('Bonded');

    return (
        <tr className={className}>
            {isGuaranteeOpen && accountId && (
                <Guarantee
                    accountId={accountId}
                    onClose={toggleGuarantee}
                />
            )}
            {isSetPrefOpen && accountId && (
                <GuaranteePref
                    accountId={accountId}
                    onClose={toggleSetPref}
                />
            )}
            <td className='address'>
                <AddressSmall value={accountId} />
            </td>

            <td className='number'>
                {effectiveCsm}
            </td>
            <td className='number'>
                {totalReward}
            </td>
            <td className='number'>
                {predictCsm}
            </td>

            <td className='number'>{t<string>('{{role}}', { replace: { role: role } })}</td>
            <td className='button'>
                {
                    <>
                        {
                            (
                                <Button.Group>
                                    <Button
                                        icon='certificate'
                                        isDisabled={isDisabled}
                                        key='validate'
                                        label={t<string>('Set Pref')}
                                        onClick={toggleSetPref}
                                    />
                                    <Button
                                        icon='hand-paper'
                                        isDisabled={isDisabled}
                                        key='nominate'
                                        label={t<string>('Guarantee')}
                                        onClick={toggleGuarantee}
                                    />
                                </Button.Group>
                            )
                        }
                        {/* <Popup
                            isOpen={isSettingsOpen}
                            key='settings'
                            onClose={toggleSettings}
                            trigger={
                                <Button
                                    icon='ellipsis-v'
                                    isDisabled={isDisabled}
                                    onClick={toggleSettings}
                                />
                            }
                        >
                            <Menu
                                onClick={toggleSettings}
                                text
                                vertical
                            >
                                Bond
                <Menu.Divider />
                                {
                                    (role !== 'Bonded' && role != 'Guarantor') ? <>
                                        {'Validate'}

                                        {
                                            <Menu.Item onClick={toggleInject}>
                                                {t<string>('Inject session keys (advanced)')}
                                            </Menu.Item>
                                        }

                                    </> : null
                                }
                            </Menu>
                        </Popup> */}
                    </>
                }
            </td>
        </tr>
    );
}

export default React.memo(styled(Account)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
