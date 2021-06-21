// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { Balance, IndividualExposure } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

import { AddressSmall, Button, Menu, Popup, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { Compact } from '@polkadot/types/codec';
import { Codec } from '@polkadot/types/types';
import { useTranslation } from '@polkadot/apps/translate';
import { StakerState } from './partials/types';
import Guarantee from './Guarantee';
import GuaranteePref from './GuaranteePref';
import UnbondFounds from './UnbondFounds';


interface Props {
    className?: string;
    isDisabled?: boolean;
    info: StakerState;
    accounts: any[];
}

export interface Guarantee extends Codec {
    targets: IndividualExposure[];
    total: Compact<Balance>;
    submitted_in: number;
    suppressed: boolean;
}

function Account({ className = '', info: { accountId, effectiveCsm, totalReward, predictCsm }, isDisabled }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [isSetPrefOpen, toggleSetPref] = useToggle();
    const [isGuaranteeOpen, toggleGuarantee] = useToggle();
    const [isSettingsOpen, toggleSettings] = useToggle();
    const [isUnbondOpen, toggleUnbond] = useToggle();
    const { queueExtrinsic } = useContext(StatusContext);

    const withdrawFunds = useCallback(
        () => {
          queueExtrinsic({
            accountId,
            extrinsic: api.tx.csmLocking.withdrawUnbonded()
          });
        },
        [api, accountId, queueExtrinsic]
      );

    const [role] = useState<string>('Bonded');

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
            {isUnbondOpen && accountId && (
                <UnbondFounds
                    accountId={accountId}
                    onClose={toggleUnbond}
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
                        <Popup
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
                                <Menu.Item onClick={toggleUnbond}>
                                    {t<string>('Unbond founds')}
                                </Menu.Item>
                                <Menu.Item
                                    onClick={withdrawFunds}
                                >
                                    {t<string>('Withdraw unbonded funds')}
                                </Menu.Item>
                            </Menu>
                        </Popup>
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
