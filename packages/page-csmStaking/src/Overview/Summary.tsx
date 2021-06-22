// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { FormatCapacity, FormatCsmBalance ,FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';

interface Props {
  info?: SummaryInfo
}

export interface SummaryInfo {
  calculatedRewards: number,
  totalEffectiveStakes: number,
  dataPower: BN
}

const UNIT = new BN(1_000_000_000_000);

function Summary({ info }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return info ? (
    <SummaryBox>
      <section className='media--800'>
        <CardSummary label={t<string>('Total Rewards')}>
          {<>{`54,000 CRU`}</>}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1000'
          label={t<string>('Issued Rewards')}
        >
          { info.calculatedRewards ?  <FormatBalance value={UNIT.muln(info.calculatedRewards)} /> : (<Spinner noLabel />)}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Pending Rewards')}
        >
          { info.calculatedRewards? <FormatBalance value={UNIT.muln(54000 - info.calculatedRewards)} /> : (<Spinner noLabel />) }
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
          label={t<string>('Data Power')}
        >
          { info.dataPower? <FormatCapacity value={info.dataPower} />  : (<Spinner noLabel />) }
        </CardSummary>
      </section>
      <section>

        <CardSummary
          className='media--1100'
          label={t<string>('Effective stake')}
        >
          { info.totalEffectiveStakes? <FormatCsmBalance value={UNIT.muln(info.totalEffectiveStakes)} />:  (<Spinner noLabel />)}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Daily Rewards per 1K CSM')}
        >
          { info ? <FormatBalance value={UNIT.muln(info.totalEffectiveStakes/1000 * 400)} /> : (<Spinner noLabel />)}
        </CardSummary>
      </section>
    </SummaryBox>
  ) : null;
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
