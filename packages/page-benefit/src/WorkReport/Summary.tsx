// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import BN from 'bn.js';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  isLoading: boolean;
  summaryInfo: SummaryInfo
}

export interface SummaryInfo {
    totalLockup: BN;
    unlocking: BN;
}

function Summary({ isLoading, summaryInfo: { totalLockup, unlocking } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  return (!isLoading) ? (
    <SummaryBox>
        <section>
            <CardSummary label={t<string>('Total lockup')}>
              <FormatBalance value={totalLockup} />
            </CardSummary>
            <CardSummary
              label={t<string>('Unlocking')}
            >
              <FormatBalance value={unlocking} />
            </CardSummary>
        </section>
    </SummaryBox>
  ) : <Spinner noLabel />;
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
