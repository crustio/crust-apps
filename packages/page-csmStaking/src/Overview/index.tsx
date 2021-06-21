// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, {  } from 'react';
import styled from 'styled-components';
import promotional from '../images/promotional.png';
import Summary from './Summary';
import CountDown from './CountDown';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

function Overview({ }: Props): React.ReactElement<Props> {
  // we have a very large list, so we use a loading delay




  return (<>
    <img src={promotional as string} style={{ "marginRight": "auto", 'textAlign': 'center', 'display': 'block' }}></img>
    <Summary />
    <CountDown />
    {/* <Table
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
    </Table> */}
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
