// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { FormatCapacity } from '@polkadot/react-query';

interface Props {
  className?: string;
  isVisible: boolean;
  next?: string[];
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  used: string;
  reserved: string;
  totalOrderCount: Number
}

function Summary ({ className = '', isVisible, used, reserved, nominators, stakingOverview, totalOrderCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={`${className}${!isVisible ? ' staking--hidden' : ''}`}>
      <section>
        {stakingOverview && (
          <CardSummary label={t<string>('meaningful capacity')}>
            <FormatCapacity value={used} />
          </CardSummary>
        )}

        {(
          <CardSummary
            className='media--1100'
            label={t<string>('total capacity')}
          >
            <FormatCapacity value={reserved} />
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t<string>('order count')}
        >
          {/* {lastBlockAuthors?.map((author): React.ReactNode => (
            <IdentityIcon
              className='validator--Account-block-icon'
              key={author}
              value={author}
            />
          ))} */}
          {totalOrderCount}
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
`);
