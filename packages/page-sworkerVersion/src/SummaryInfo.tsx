// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import VersionInfo, { SworkerVersion } from './VersionInfo';
import { useApi } from '@polkadot/react-hooks';
import _ from 'lodash';
import { versionsRecord, versionsStartBlockRecord } from './versionQuery/VersionsState';

interface Props {
  className?: string;
  current: number;
}

function Summary({ className, current }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summaryInfo, setSummaryInfo] = useState<SworkerVersion[]>([]);
  
  const versionHeaderRef = useRef([
    [t('Current availabe sWorker'), 'start'],
    [t('Proportion')],
    [t('Release')],
    [t('Due date')],
    [t('Progress bar')]
  ]);

  const getVersionSummaryInfo = () => {
    let unsub: (() => void) | undefined;
    const fns: any[] = [
      [api.query.swork.pubKeys.entries]
    ];
    const sv: SworkerVersion[] = [];

    api.combineLatest<any[]>(fns, ([pubkyes]): void => {
      const availabeCode: any[] = []
      if (Array.isArray(pubkyes)) {
        pubkyes.forEach(([{ args: [_] }, value]) => {
          if (versionsRecord[value.code]) {
            availabeCode.push(value)
          }
        });
        const codeGroup = _.groupBy(availabeCode, 'code');
        const total = availabeCode.length
        Object.entries(codeGroup).forEach(([code, entries]) => {
          api.query.swork.codes(code).then(res => {
            const codeInfo = JSON.parse(JSON.stringify(res));
            sv.push({
              version: code,
              start: versionsStartBlockRecord[code],
              end: codeInfo,
              proportion: _.divide(entries.length, total)
            })
          })
        });
        setSummaryInfo(sv);
        setIsLoading(false);
      }
    }).then((_unsub): void => {
      unsub = _unsub;
    }).catch(console.error);

    return (): void => {
      unsub && unsub();
    };
  };

  useEffect(() => {
    getVersionSummaryInfo()
  }, [])

  return (<div className={className}>
    <Table
        header={versionHeaderRef.current}
        empty={ !isLoading && t<string>('No funds availabe sWorker yet.')}
    >
        {summaryInfo && summaryInfo?.map((sv): React.ReactNode => (
            <VersionInfo
                key={sv.version}
                sworkerVersion={sv}
                current={current}
            />
        ))}
    </Table>
  </div>)
}

export default React.memo(styled(Summary)`
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }

  .progress4 {
    display: block;    
    font: inherit;
    height: 20px;
    width: 100%;
    pointer-events: none;
  }
`);
