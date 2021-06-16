// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, {  } from 'react';
import styled from 'styled-components';
import promotional from '../images/promotional.png';
import Summary from './Summary';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function Overview ({ }: Props): React.ReactElement<Props> {
  
  return (<>
    {/* <div className={'promotional'}/> */}
    <img src={promotional as string} style={{ "marginRight":"auto", 'textAlign': 'center', 'display': 'block'}}></img>
    <Summary />
    <div className={'comingsoon'}/>
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
