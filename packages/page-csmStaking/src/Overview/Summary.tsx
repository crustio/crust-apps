// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';

interface Props {
  nominators?: string[];
}

function Summary({ }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox>
      <section className='media--800'>
        <CardSummary label={t<string>('Total Rewards')}>
          {<>{`54,000 CRU`}</>}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1000'
          label={t<string>('Output Rewards')}
        >
          <Spinner noLabel />
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Pending Rewards')}
        >
          <Spinner noLabel />
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Daily Rewards')}
        >
          {<>{`400 CRU`}</>}
        </CardSummary>
      </section>
      <section>

        <CardSummary
          className='media--1100'
          label={t<string>('Storage Rewards')}
        >
          <Spinner noLabel />
        </CardSummary>
      </section>
      <section>

        <CardSummary
          className='media--1100'
          label={t<string>('Effective stake')}
        >
          <Spinner noLabel />
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Daily Rewards per 1K CSM')}
        >
          <Spinner noLabel />
        </CardSummary>
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
`);
