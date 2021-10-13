// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { useApi } from '@polkadot/react-hooks';
import _ from 'lodash';
import MemberVersionDisplay from './memberVersionDisplay';

interface Props {
    className?: string;
    address: string
}

interface SworkerVersion {
    version: string;
    count: number
}

export interface MemberVersions {
    address: string;
    version: string;
}

interface AddressVersionState {
    owner?: string;
    memberVersions: MemberVersions[];
    versions?: SworkerVersion[];
    versionCount?: Record<string, number>
}

export const versionsRecord: Record<string, string> = {
    '0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4': 'Version A',
    '0x673dcb16fe746ba752cd915133dc9135d59d6b7b022df58de2a7af4303fcb6e0': 'Version B'
};

function VersionState ({ className = '', address }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const { api } = useApi();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [addressVersionStateInfo, setAddressVersionStateInfo] = useState<AddressVersionState>();

    useEffect(() => {
        api.query.swork.groups(address).then(res => {
            const groupInfo = JSON.parse(JSON.stringify(res))
            const members = groupInfo.members
            if (members && members.length) {
                setIsOwner(true);
                api.query.swork?.identities?.multi(members).then(res => {
                    const identities = JSON.parse(JSON.stringify(res));
                    const identitiesObj = identities.map((opt: any, index: string | number) => [members[index], opt.anchor])
                    const queryInfo = identitiesObj.map((e: any[]) => e[1]);
                    api.query.swork.pubKeys.multi(queryInfo).then(res => {
                        const pubkeys = JSON.parse(JSON.stringify(res));
                        const memberVersions = pubkeys
                        // @ts-ignore
                        .map((opt, index) => {
                            return {
                                address: members[index],
                                version: opt.code
                            }
                        })
                        const versionGroup = _.groupBy(memberVersions, 'version');
                        const sworkerVersion: SworkerVersion[] = [];
                        const versionCount: Record<string, number> = {};
    
                        Object.entries(versionGroup).forEach(([code, members]) => {
                            versionCount[versionsRecord[code]] = members.length
                            sworkerVersion.push({
                                version: versionsRecord[code],
                                count: members.length
                            })
                        })

                        setAddressVersionStateInfo({
                            owner: address,
                            memberVersions: memberVersions as unknown as MemberVersions[],
                            versions: sworkerVersion,
                            versionCount
                        })
                        // console.log('memberVersions', memberVersions)
    
                        setIsLoading(false)
                    })
                })
            } else {
                setIsOwner(false);
                api.query.swork?.identities(address).then(res => {
                    const identities = JSON.parse(JSON.stringify(res));
                    const identitiesObj = [address, identities.anchor]
                    const queryInfo = identitiesObj[1];
                    api.query.swork.pubKeys(queryInfo).then(res => {
                        const pubkeys = JSON.parse(JSON.stringify(res));
                        const memberVersions = [];
                        memberVersions.push({
                            address: identitiesObj[0],
                            version: pubkeys.code
                        })
                        setAddressVersionStateInfo({
                            memberVersions: memberVersions as unknown as MemberVersions[]
                        })
                        setIsLoading(false)
                        console.log('res', JSON.stringify(res))
                    })
                })
            }
        })
    }, [api, address])

    const ownerHeaderRef = useRef([
        [t('group owner'), 'start'],
        [t('Members')],
        [t('Version A (Ubuntu)')],
        [t('Version B (Ubuntu)')]
    ]);

    const memberHeaderRef = useRef([
        [t('group member'), 'start'],
        [t('Version')],
    ]);

    return (
        <div className={className}>
            {
                isOwner ?
                (<>
                    <Table
                        header={ownerHeaderRef.current}
                        empty={ !isLoading && !addressVersionStateInfo && t<string>('No funds group owner yet.')}
                    >
                        {addressVersionStateInfo && (<tr className={className}>
                            <td className='start'>
                                {address}           
                            </td>
                            <td className='number'>
                                {addressVersionStateInfo.memberVersions.length}           
                            </td>
                            <td className='number'>
                                {addressVersionStateInfo.versionCount && addressVersionStateInfo.versionCount['Version A']}           
                            </td>
                            <td className='number'>
                                {addressVersionStateInfo.versionCount && addressVersionStateInfo.versionCount['Version B']}           
                            </td>
                        </tr>)}
                    </Table>
                    <Table
                        header={memberHeaderRef.current}
                        empty={!isLoading && !addressVersionStateInfo && t<string>('No funds group member yet.')}
                    >
                        {addressVersionStateInfo && addressVersionStateInfo.memberVersions?.map((mv): React.ReactNode => (
                            <MemberVersionDisplay
                                key={mv.address}
                                memberVersion={mv}
                            />
                        ))}
                    </Table>
                </>) :
                (<>
                    <Table
                        header={memberHeaderRef.current}
                        empty={!isLoading && !addressVersionStateInfo && t<string>('No funds group member yet.')}
                    >
                        {addressVersionStateInfo && addressVersionStateInfo.memberVersions?.map((mv): React.ReactNode => (
                            <MemberVersionDisplay
                                key={mv.address}
                                memberVersion={mv}
                            />
                        ))}
                    </Table>
                </>)
            }
        </div>
    );
}

export default React.memo(styled(VersionState)`
.filter--tags {
  .ui--Dropdown {
    padding-left: 0;

    label {
      left: 1.55rem;
    }
  }
}
`);
