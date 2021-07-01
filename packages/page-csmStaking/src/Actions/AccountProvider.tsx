// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { BlockNumber } from '@polkadot/types/interfaces';

import { Button, Icon, Menu, Popup, StatusContext, Tooltip } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';
import { ProviderState } from './partials/types';
import Guarantee from './Guarantee';
import GuaranteePref from './GuaranteePref';
import UnbondFounds from './UnbondFounds';
import { FormatCsmBalance, FormatBalance, FormatDataPower } from '@polkadot/react-query';
import GuarantorStake from './GuarantorStake';
import UnLockingCsms from './UnLockingCsms';
import Bond from './Bond';
import { Capacity_Unit } from '..';
import { formatNumber } from '@polkadot/util';
import AddressStatusSmall from './AddressStatusSmall';

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: ProviderState;
    accounts: any[];
    providers: string[];
}

const UNIT = new BN(1_000_000_000_000);

function Account({ className = '', info: { account, totalRewards, pendingRewards, guarantors, guaranteeFee, storage, pendingFiles, frozenBn }, isDisabled, providers }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [isSetPrefOpen, toggleSetPref] = useToggle();
    const [isGuaranteeOpen, toggleGuarantee] = useToggle();
    const [isSettingsOpen, toggleSettings] = useToggle();
    const [isUnbondOpen, toggleUnbond] = useToggle();
    const [isBondExtraOpen, toggleBondExtra] = useToggle();
    const { queueExtrinsic } = useContext(StatusContext);
    const [totalCSM, setTotalCSM] = useState<BN>(BN_ZERO);
    const query = guarantors.concat(account);
    const multiQuery = useCall<any[]>(api.query.csmLocking.ledger.multi, [query]);
    const bestNumberFinalized = useCall<BlockNumber>(api.derive.chain.bestNumberFinalized);
    const [guaranteeFeeDisable, setGuaranteeFeeDisable] = useState<boolean>(false);

    useEffect(() => {
        const tmp = multiQuery && JSON.parse(JSON.stringify(multiQuery))
        let total = BN_ZERO
        if (tmp && tmp.length) {
            for (const ledger of tmp) {
                total = total.add(new BN(Number(ledger.active).toString()))
            }
            setTotalCSM(total)
        }

    }, [multiQuery])

    useEffect(() => {
        if (frozenBn > Number(bestNumberFinalized)) {
            setGuaranteeFeeDisable(true);
        }
    }, [frozenBn, bestNumberFinalized])

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
                    frozenBn={frozenBn}
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
                <AddressStatusSmall value={account} frozenBn={frozenBn} />
            </td>
            <GuarantorStake guarantors={guarantors} />
            <td className='number'>
                <FormatDataPower value={Capacity_Unit.muln(storage)} />
            </td>
            <td className='number'>
                {formatNumber(pendingFiles)}
            </td>
            <td className='number'>
                <FormatCsmBalance value={totalCSM} />
            </td>
            <td className='number'>
                <UnLockingCsms account={account}  value={account} />
            </td>
            <td className='number'>
                <FormatBalance value={UNIT.muln(totalRewards)} />
            </td>
            <td className='number'>
                <FormatBalance value={UNIT.muln(pendingRewards)} />
            </td>
            <td className='number'>
                {guaranteeFee * 100 + "%"}
            </td>

            <td className='button'>
                {
                    <>
                        {
                            ( 
                                <Button.Group>
                                    {guaranteeFeeDisable ?
                                        (<><Icon
                                            color="red"
                                            icon='info-circle'
                                            tooltip={`${account}-locks-trigger-set-guarantee-fee`}
                                        />
                                            <Tooltip
                                                text={t<string>('You can not set guarantee fee until block {{bn}}', {
                                                    replace: {
                                                        bn: frozenBn
                                                    }
                                                })}
                                                trigger={`${account}-locks-trigger-set-guarantee-fee`}
                                            ></Tooltip>
                                        </>) : null
                                    }
                                    <Button
                                        icon='certificate'
                                        isDisabled={guaranteeFeeDisable}
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
                                    {t<string>('Unbond funds')}
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
