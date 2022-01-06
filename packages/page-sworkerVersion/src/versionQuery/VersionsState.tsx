// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Card, Columar, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { PKInfo } from '../SummaryInfo';
import MemberVersionDisplay from './MemberVersion';

interface Props {
  className?: string;
  address: string;
  current: number;
  pkInfos: PKInfo[];
  isLoading: boolean;
  setMessage: (message: string) => void;
  setStatus: (status: string) => void;
  setStatusOpen: (isOpen: boolean) => void;
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
  memberVersionGroup?: [string, MemberVersions[]][];
  versions?: SworkerVersion[];
  versionCount?: Record<string, number>
}

export const versionsRecord: Record<string, string> = {
  '0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4': 'V1.0.0 : First Version',
  '0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a': 'V1.1.0 : Support Metaverse',
  '0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503': 'V1.1.1 : Protect Diskdrop'
};

export const versionsStartBlockRecord: Record<string, number> = {
  '0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4': 490089,
  '0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a': 1382305,
  '0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503': 2143559
};

export const versionsReleaseRecord: Record<string, string> = {
    '0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4': 'https://github.com/crustio/crust-sworker/releases/tag/v1.0.0',
    '0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a': 'https://github.com/crustio/crust-sworker/releases/tag/v1.1.0',
    '0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503': 'https://github.com/crustio/crust-sworker/releases/tag/v1.1.1'
};

function VersionState ({ address, className = '', current, isLoading: summaryLoading, pkInfos, setMessage, setStatus, setStatusOpen }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(summaryLoading);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [addressVersionStateInfo, setAddressVersionStateInfo] = useState<AddressVersionState>();

  useEffect(() => {
    api.query.swork.groups(address).then((res) => {
      const groupInfo = JSON.parse(JSON.stringify(res));
      const members = groupInfo.members;

      if (members && members.length) {
        setIsOwner(true);

        api.query.swork?.identities?.multi(members).then((res) => {
          const identities = JSON.parse(JSON.stringify(res));
          const memberVersions = identities.map((identity: { anchor: string; }, index: number) => {
            const pkIndex = _.findIndex(pkInfos, (e) => e.anchor == identity.anchor);

            return {
              address: members[index],
              version: pkInfos[pkIndex]?.code
            };
          });
          const versionGroup = _.groupBy(memberVersions, 'version');
          const memberVersionGroup: [string, MemberVersions[]][] = [];
          const sworkerVersion: SworkerVersion[] = [];
          const versionCount: Record<string, number> = {};

          Object.entries(versionGroup).forEach(([code, members]) => {
            versionCount[versionsRecord[code]] = members.length;
            sworkerVersion.push({
              version: versionsRecord[code],
              count: members.length
            });
            memberVersionGroup.push([versionsRecord[code], members as unknown as MemberVersions[]]);
          });

          setAddressVersionStateInfo({
            owner: address,
            memberVersions: memberVersions as unknown as MemberVersions[],
            memberVersionGroup,
            versions: sworkerVersion,
            versionCount
          });

          setIsLoading(false);
        });
      } else {
        setIsOwner(false);
        api.query.swork?.identities(address).then((res) => {
          const identities = JSON.parse(JSON.stringify(res));

          if (identities) {
            const pkIndex = _.findIndex(pkInfos, (e) => e.anchor == identities.anchor);
            const memberVersions = [];

            memberVersions.push({
              address,
              version: pkInfos[pkIndex]?.code
            });
            setAddressVersionStateInfo({
              memberVersions: memberVersions as unknown as MemberVersions[]
            });
            setIsLoading(false);
          } else {
            setAddressVersionStateInfo(undefined);
          }
        }).finally(() => setIsLoading(false));
      }
    });
  }, [api, address, pkInfos]);

  const ownerHeaderRef = useRef([
    [t('Group Owner'), 'start'],
    [t('Members')],
    [t('V1.0.0')],
    [t('V1.1.0')],
    [t('V1.1.1')]
  ]);

  const memberHeaderRef = useRef([
    [t('Group Member'), 'start'],
    [t('Version'), 'start']
  ]);

  return (
    <div className={className}>
      {
        isOwner
          ? (<>
            <Table
              empty={ !isLoading && !addressVersionStateInfo && t<string>('No funds group owner yet.')}
              header={ownerHeaderRef.current}
            >
              {addressVersionStateInfo && (<tr className={className}>
                <td className='start'>
                  {address}
                </td>
                <td className='number'>
                  {addressVersionStateInfo.memberVersions.length}
                </td>
                <td className='number'>
                  {addressVersionStateInfo.versionCount && addressVersionStateInfo.versionCount['V1.0.0 : First Version'] ? addressVersionStateInfo.versionCount['V1.0.0 : First Version'] : 0}
                </td>
                <td className='number'>
                  {addressVersionStateInfo.versionCount && addressVersionStateInfo.versionCount['V1.1.0 : Support Metaverse'] ? addressVersionStateInfo.versionCount['V1.1.0 : Support Metaverse'] : 0}
                </td>
                <td className='number'>
                  {addressVersionStateInfo.versionCount && addressVersionStateInfo.versionCount['V1.1.1 : Protect Diskdrop'] ? addressVersionStateInfo.versionCount['V1.1.1 : Protect Diskdrop'] : 0}
                </td>
              </tr>)}
            </Table>
            <Card>
              <Columar>
                {
                  addressVersionStateInfo && addressVersionStateInfo.memberVersionGroup?.map((e): React.ReactNode => (
                    <Columar.Column>
                      <Table
                        empty={!isLoading && !addressVersionStateInfo && t<string>('No funds group member yet.')}
                        header={memberHeaderRef.current}
                        key={e[0]}
                      >
                        {e[1] && e[1]?.map((mv): React.ReactNode => (
                          <MemberVersionDisplay
                            current={current}
                            key={mv.address}
                            memberVersion={mv}
                            setMessage={setMessage}
                            setStatus={setStatus}
                            setStatusOpen={setStatusOpen}
                          />
                        ))}
                      </Table>
                    </Columar.Column>
                  ))
                }
              </Columar>
            </Card>
          </>)
          : (<>
            <Table
              empty={!isLoading && !addressVersionStateInfo && t<string>('No funds group member yet.')}
              header={memberHeaderRef.current}
            >
              {addressVersionStateInfo && addressVersionStateInfo.memberVersions?.map((mv): React.ReactNode => (
                <MemberVersionDisplay
                  current={current}
                  key={mv.address}
                  memberVersion={mv}
                  setMessage={setMessage}
                  setStatus={setStatus}
                  setStatusOpen={setStatusOpen}
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
