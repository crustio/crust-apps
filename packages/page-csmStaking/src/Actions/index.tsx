// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { Button } from '@polkadot/react-components';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, {  } from 'react';
import styled from 'styled-components';
import NewDataGuarantor from './NewDataGuarantor';
import NewDataMiner from './NewDataMiner';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function Actions ({ }: Props): React.ReactElement<Props> {
  
  return (
    <div>

      <Button.Group>
        <NewDataGuarantor />
        <NewDataMiner />
      </Button.Group>
      <div className={'comingsoon'}/>
    </div>

  );
}

export default React.memo(styled(Actions)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
