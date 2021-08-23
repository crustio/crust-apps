// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';

import React, { useContext } from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, IdentityIcon, Spinner, SummaryBox } from '@polkadot/react-components';
import { BlockAuthorsContext } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import StakingRewardPot from './StakingRewardPot';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  isVisible: boolean;
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
}

function Summary ({ className = '', isVisible, stakingOverview, targets: { inflation: { inflation }, nominators, waitingIds } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { lastBlockAuthors, lastBlockNumber } = useContext(BlockAuthorsContext);
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';

  return (
    <SummaryBox className={`${className}${!isVisible ? ' staking--hidden' : ''}`}>
      <section>
        <CardSummary label={t<string>('validators')}>
          {stakingOverview
            ? <>{formatNumber(stakingOverview.validators.length)}&nbsp;/&nbsp;{formatNumber(stakingOverview.validatorCount)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1000'
          label={t<string>('waiting')}
        >
          {waitingIds
            ? formatNumber(waitingIds.length)
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1100'
          label={t<string>('guarantors')}
        >
          {nominators
            ? formatNumber(nominators.length)
            : <Spinner noLabel />
          }
        </CardSummary>
        {/* <CardSummary
          className='media--1200'
          label={t<string>('inflation')}
        >
          {(inflation > 0) && Number.isFinite(inflation)
            ? <>{inflation.toFixed(1)}%</>
            : '-'
          }
        </CardSummary> */}
        {isMaxwell ? (
          <CardSummary
            className='media--1100'
            label={t<string>('rewards')}
          >
            <StakingRewardPot />
          </CardSummary>
        ) : (<CardSummary
          className='media--1100'
          label={t<string>('rewards')}
        >
          <meter id="progress3" className="progress4" max="877" value="123"></meter>
          {t<string>('not started yet')}
        </CardSummary>)}
      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t<string>('last block')}
        >
          {lastBlockAuthors?.map((author): React.ReactNode => (
            <IdentityIcon
              className='validator--Account-block-icon'
              key={author}
              value={author}
            />
          ))}
          {lastBlockNumber}
        </CardSummary>
      </section>
      <section>
        <SummarySession />
      </section>
    </SummaryBox>
  );
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

  .progress3 {
    height: 20px;
    width: 120px;
    -webkit-appearance: none;
    display: block;
  }
  .progress3::-webkit-progress-value {
    background: linear-gradient(
      -45deg, 
      transparent 33%, 
      rgba(0, 0, 0, .1) 33%, 
      rgba(0,0, 0, .1) 66%, 
      transparent 66%
    ),
      linear-gradient(
        to top, 
        rgba(255, 255, 255, .25), 
        rgba(0, 0, 0, .25)
      ),
      linear-gradient(
        to left,
        #09c,
        #f44);
    border-radius: 2px; 
    background-size: 35px 20px, 100% 100%, 100% 100%;
  }

  .progress4 {
    display: block;    
    font: inherit;
    height: 20px;
    width: 160px;
    pointer-events: none;
  }
`);
