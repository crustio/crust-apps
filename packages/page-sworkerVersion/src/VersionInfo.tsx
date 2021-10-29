// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React from 'react';
import styled from 'styled-components';

import { versionsRecord, versionsReleaseRecord } from './versionQuery/VersionsState';
import { formatNumber } from '@polkadot/util';

export interface SworkerVersion {
    version: string;
    start: number;
    end: number;
    proportion: number;
}


interface Props {
    className?: string;
    isDisabled?: boolean;
    sworkerVersion: SworkerVersion;
    current: number;
}

function VersionInfoDisplay({ className = '', sworkerVersion: { start, version, end, proportion }, current }: Props): React.ReactElement<Props> | null {
    
    return (
        (<tr className={className}>
            <td className='start'>
                <a href={versionsReleaseRecord[version]} target="_blank">{versionsRecord[version]}</a>           
            </td>
            <td className='number'>
                {(proportion * 100).toFixed(2) + '%' }           
            </td>
            <td className='number'>
                {`block: ${formatNumber(start)}`}           
            </td>
            <td className='number'>
                {`block: ${formatNumber(end)}`}           
            </td>
            <td className='number'>
              <meter id="progress" className="progress4" max={end} value={end - current}></meter>
            </td>
        </tr>)
    );
}

export default React.memo(styled(VersionInfoDisplay)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }

  .progress4 {
    display: block;    
    font: inherit;
    height: 20px;
    width: 100%;
    pointer-events: none;
  }
`);
