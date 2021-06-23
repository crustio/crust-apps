// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AddressSmall, Button, Menu, Popup, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';
import { GuarantorState } from './partials/types';
import Guarantee from './Guarantee';
import GuaranteePref from './GuaranteePref';
import UnbondFounds from './UnbondFounds';
import { FormatCsmBalance ,FormatBalance } from '@polkadot/react-query';
import UnLockingCsms from './UnLockingCsms';
import Bond from './Bond';

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: GuarantorState;
    accounts: any[];
    providers: string[];
}

const UNIT = new BN(1_000_000_000_000);

function Account({ className = '', info: { account, totalRewards, pendingRewards, provider }, providers, isDisabled }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [isSetPrefOpen, toggleSetPref] = useToggle();
    const [isGuaranteeOpen, toggleGuarantee] = useToggle();
    const [isSettingsOpen, toggleSettings] = useToggle();
    const [isUnbondOpen, toggleUnbond] = useToggle();
    const [isBondExtraOpen, toggleBondExtra] = useToggle();
    const { queueExtrinsic } = useContext(StatusContext);
    const [ totalCSM, setTotalCSM ] = useState<BN>(BN_ZERO);

    useEffect(() => {
        api.query.csmLocking.ledger(account)
        .then(res => setTotalCSM(JSON.parse(JSON.stringify(res)).active))
    }, [api, account])

    const withdrawFunds = useCallback(
        () => {
          queueExtrinsic({
            accountId: account,
            extrinsic: api.tx.csmLocking.withdrawUnbonded()
          });
        },
        [api, account, queueExtrinsic]
      );

    return (
        <tr className={className}>
            {isGuaranteeOpen && account && (
                <Guarantee
                    accountId={account}
                    onClose={toggleGuarantee}
                    providers={providers}
                />
            )}
            {isSetPrefOpen && account && (
                <GuaranteePref
                    accountId={account}
                    onClose={toggleSetPref}
                />
            )}
            {isUnbondOpen && account && (
                <UnbondFounds
                    accountId={account}
                    onClose={toggleUnbond}
                />
            )}
            {isBondExtraOpen && account && (
                <Bond
                    accountId={account}
                    onClose={toggleBondExtra}
                />
            )}
            <td className='address'>
                <AddressSmall value={account} />
            </td>
            <td className='address'>
                <AddressSmall value={provider} />
            </td>
            <td className='number'>
                <FormatCsmBalance value={totalCSM} />
            </td>
            <td className='number'>
                <UnLockingCsms account={account} value={account} />
            </td>
            <td className='number'>
                <FormatBalance value={UNIT.muln(totalRewards)} />
            </td>
            <td className='number'>
                <FormatBalance value={UNIT.muln(pendingRewards)} />
            </td>

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
                                        label={t<string>('Guarantee fee')}
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
                                <Menu.Item onClick={toggleBondExtra}>
                                    {t<string>('Bond extra')}
                                </Menu.Item>
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
