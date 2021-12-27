// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AddressMini, Button } from '@polkadot/react-components';

import { MemberVersions, versionsRecord } from './VersionsState';
import Status from './Status';
import { useTranslation } from '@polkadot/apps/translate';
import { httpGet, httpPost } from './http';

interface Props {
    className?: string;
    isDisabled?: boolean;
    memberVersion: MemberVersions;
    current: number;
    setMessage: (message: string) => void;
    setStatus: (status: string) => void;
    setStatusOpen: (isOpen: boolean) => void;
}

const Claim_Status = ["Already claimed reward", "Success", "Upgrade to latest code", "Tx failed", "Storage not enough", "No identities", "Unreported workload"];

function MemberVersionDisplay({ className = '', memberVersion: { address, version }, current, setMessage, setStatus, setStatusOpen }: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const [canClaimed, setCanClaimed] = useState<boolean>(false);
    const [cliamedLable, setCliamedLable] = useState<string>('Claim reward');

    useEffect(() => {
        httpGet('http://localhost:8848/api/addressRewarded/' + address).then((res: any) => {
            if (res.code == 200) {
                setCanClaimed(res.statusText)
                setCliamedLable(Claim_Status[res.statusCode])
            }
        })
    }, [address, version])

    const handleAccountStep = useCallback(async () => {
        try {
            setIsBusy(true);
            const result = await httpPost("http://localhost:8848/api/claimReward", JSON.stringify({
                address
            }));    

            setIsBusy(false);
            setMessage(result.statusText);
            setStatus(result.status);
            setStatusOpen(true)
            const claimedResult = await httpGet('http://localhost:8848/api/addressRewarded/' + address);
            setCanClaimed(claimedResult.statusText)
            setCliamedLable(Claim_Status[claimedResult.statusCode])
        } catch (error) {
            setIsBusy(false);
        }
    }, [address])

    return (
        <>
            <tr className={className}>
                <td className='start'>
                    <Status
                        current={current}
                        code={version}
                    />
                    <AddressMini value={address} />        
                </td>
                <td className='start'>
                    {versionsRecord[version]}&nbsp;&nbsp;
                    {(<Button.Group>
                        <Button
                            icon='paper-plane'
                            label={t<string>(cliamedLable)}
                            isDisabled={!canClaimed}
                            onClick={handleAccountStep}
                            isBusy={isBusy}
                        />
                    </Button.Group>)}
                </td> 

            </tr>
        </>
    );
}

export default React.memo(styled(MemberVersionDisplay)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
