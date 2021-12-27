// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { FormatDataPower, FormatCsmBalance ,FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';
import { formatNumber } from '@polkadot/util';

interface Props {
  info?: SummaryInfo;
  isLoading: boolean;
}

export interface SummaryInfo {
  calculatedRewards: number,
  totalEffectiveStakes: number,
  totalProviders: number,
  totalGuarantors: number,
  dataPower: BN
}

const UNIT = new BN(1_000_000_000_000);

function Summary({ info, isLoading }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const daily = info ? 1000 / info.totalEffectiveStakes : 0;
  return (!isLoading) ? (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('providers / guarantors')}>
            {info
              ? <>{formatNumber(info.totalProviders)}&nbsp;/&nbsp;{formatNumber(info.totalGuarantors)}</>
              : <Spinner noLabel />
            }
        </CardSummary>
      </section>
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
          { info ? <> {formatNumber(info.calculatedRewards)} CRU </>: (<Spinner noLabel />)}
        </CardSummary>
      </section>

      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Daily Rewards')}
        >
          {<>{`0 CRU`}</>}
        </CardSummary>
      </section>
      <section>

        <CardSummary
          className='media--1100'
          label={t<string>('Data Power')}
        >
          { info ? <FormatDataPower value={info.dataPower} />  : (<Spinner noLabel />) }
        </CardSummary>
      </section>
      <section>

        <CardSummary
          className='media--1100'
          label={t<string>('Effective stake')}
        >
          { info ? <FormatCsmBalance value={UNIT.muln(info.totalEffectiveStakes)} />:  (<Spinner noLabel />)}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1100'
          label={t<string>('Daily Rewards per 1K CSM')}
        >
          { info ? <FormatBalance value={UNIT.muln((daily > 1 ? 1 :daily) * 200)} /> : (<Spinner noLabel />)}
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
