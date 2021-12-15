// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React from 'react';
import styled from 'styled-components';

import { AddressMini, Button } from '@polkadot/react-components';

import { MemberVersions, versionsRecord } from './VersionsState';
import Status from './Status';
import { useTranslation } from '@polkadot/apps/translate';

interface Props {
    className?: string;
    isDisabled?: boolean;
    memberVersion: MemberVersions;
    current: number;
}

function MemberVersionDisplay({ className = '', memberVersion: { address, version }, current }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();

    return (
        <tr className={className}>
            <td className='start'>
                <Status
                    current={current}
                    code={version}
                />
                <AddressMini value={address} />        
            </td>
            <td className='start'>
                {versionsRecord[version]}
                <Button.Group>
                    <Button
                        icon='paper-plane'
                        label={t<string>('Claim reward')}
                    />
                </Button.Group>
            </td> 
        </tr>
    );
}

export default React.memo(styled(MemberVersionDisplay)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
