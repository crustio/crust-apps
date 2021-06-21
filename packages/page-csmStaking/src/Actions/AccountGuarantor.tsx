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
import { GuarantorState } from './partials/types';
import Guarantee from './Guarantee';
import GuaranteePref from './GuaranteePref';
import UnbondFounds from './UnbondFounds';
import { FormatCapacity, FormatCsmBalance ,FormatBalance } from '@polkadot/react-query';

interface Props {
    className?: string;
    isDisabled?: boolean;
    info: GuarantorState;
    accounts: any[];
}

const UNIT = new BN(1_000_000_00_000);

function Account({ className = '', info: { account, effectiveCsm, totalRewards, pendingRewards, role }, isDisabled, accounts }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [isSetPrefOpen, toggleSetPref] = useToggle();
    const [isGuaranteeOpen, toggleGuarantee] = useToggle();
    const [isSettingsOpen, toggleSettings] = useToggle();
    const [isUnbondOpen, toggleUnbond] = useToggle();
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
            <td className='address'>
                <AddressSmall value={account} />
            </td>

            <td className='number'>
                <FormatCsmBalance value={totalCSM} />
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
