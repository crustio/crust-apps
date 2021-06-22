// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import promotional from '../images/promotional.png';
import Summary, { SummaryInfo } from './Summary';
import { Table } from '@polkadot/react-components';
import { useSavedFlags } from '@polkadot/react-hooks';
import Filtering from '@polkadot/app-staking/Filtering';
import DataProvider from './DataProvider';
import { DataProviderState } from './types';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  providers: DataProviderState[];
  isLoading: boolean;
  summaryInfo: SummaryInfo
}

function Overview({ providers, isLoading, summaryInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // we have a very large list, so we use a loading delay
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('csmStaking:overview', { withIdentity: false });
  console.log('summaryInfo', summaryInfo)
  
  const headerRef = useRef([
    [t('providers'), 'address'],
    [t('data size'), 'number'],
    [t('CSM limit'), 'number'],
    [t('effective stakes'), 'number'],
    [t('total stakes'), 'number'],
    [t('guarantee fee'), 'number']
  ]);

  const _renderRows = useCallback(
    (addresses?: DataProviderState[]): React.ReactNode[] =>
      (addresses || []).map((info): React.ReactNode => (
        <DataProvider
          info={info}
          filterName={nameFilter}
          withIdentity={toggles.withIdentity}
        />
      )),
    [nameFilter, toggles]
  );

  return (<>
    <img src={promotional as string} style={{ "marginRight": "auto", 'textAlign': 'center', 'display': 'block' }}></img>
    <Summary info={summaryInfo} />
    <Table
      empty={!isLoading && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
      header={headerRef.current}
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          setWithIdentity={setToggle.withIdentity}
          withIdentity={toggles.withIdentity}
        />
      }
    >
      {isLoading ? undefined : _renderRows(providers)}
    </Table>
  </>
  );
}

export default React.memo(styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
