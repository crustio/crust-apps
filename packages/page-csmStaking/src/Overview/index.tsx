// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import promotional from '../images/promotional.png';
import Summary from './Summary';
import { dataProviders } from './mock';
import { Table } from '@polkadot/react-components';
import { useLoadingDelay, useSavedFlags } from '@polkadot/react-hooks';
import Filtering from '@polkadot/app-staking/Filtering';
import DataProvider from './DataProvider';
import { DataProviderState } from './types';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function Overview ({ }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('csmStaking:overview', { withIdentity: false });

  const headerRef = useRef([
    [t('addresses'), 'address'],
    [t('storage data'), 'number'],
    [t('csm limit'), 'number'],
    [t('effective stakes'), 'number'],
    [t('total stakes'), 'number'],
    [t('csm guarantee fee'), 'number']
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
    <img src={promotional as string} style={{ "marginRight":"auto", 'textAlign': 'center', 'display': 'block'}}></img>
    <Summary />
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
        {isLoading ? undefined : _renderRows(dataProviders)}
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
