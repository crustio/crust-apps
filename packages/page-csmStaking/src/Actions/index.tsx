// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function Actions ({ }: Props): React.ReactElement<Props> {

  return (
    <div>
      {/* <Button.Group>
        <NewDataGuarantor />
        <NewDataProvider />
        <NewBond />
      </Button.Group> */}
      <div className={'comingsoon'}/>
      {/* <Table
        empty={hasAccounts && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={headerRef.current}
      >
        {accounts?.map((info): React.ReactNode => (
          <Account
            info={info}
            targets={accounts}
          />
        ))}
      </Table>

      <Table
        empty={hasAccounts && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={headerRef.current}
      >
        {accounts?.map((info): React.ReactNode => (
          <Account
            info={info}
            targets={accounts}
          />
        ))}
      </Table> */}
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
