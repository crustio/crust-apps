// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import VersionInfo, { SworkerVersion } from './VersionInfo';
import Banner from '@polkadot/app-accounts/Accounts/Banner';

interface Props {
  className?: string;
  current: number;
  summaryInfo: SworkerVersion[];
  isLoading: boolean;
}

export interface PKInfo {
  code: string;
  anchor: string;
}

function Summary({ className, current, summaryInfo, isLoading }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  
  const versionHeaderRef = useRef([
    [t('Current available sWorker'), 'start'],
    [t('Proportion')],
    [t('Release')],
    [t('Due date')],
    [t('Expiration countdown')]
  ]);

  return (<div className={className}>
    <Banner type='warning'>
      <p>{t<string>('Please be sure to follow the steps in the upgrade guide to upgrade sWorker')}</p>
    </Banner>
    <Table
        header={versionHeaderRef.current}
        empty={ !isLoading && t<string>('No funds available sWorker yet.')}
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
