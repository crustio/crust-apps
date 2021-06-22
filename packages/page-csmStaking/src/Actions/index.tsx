// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Table } from '@polkadot/react-components';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import NewBond from './NewBond';
import NewDataGuarantor from './NewDataGuarantor';
import { accounts } from './mock';
import { useAccounts } from '@polkadot/react-hooks';
import AccountProvider from './AccountProvider';
import AccountGuarantor from './AccountGuarantor';
import NewDataProvider from './NewDataProvider';
import { httpPost } from '../http';
import lodash from 'lodash';
import { ProviderState, GuarantorState } from './partials/types';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  providers: string[];
}

function Actions ({ providers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const [ownProviders, setOwnProviders ] = useState<ProviderState[]>([]);
  const [ownGuarantors, setOwnGuarantors ] = useState<GuarantorState[]>([]);

  useEffect(() => {
    httpPost('http://crust-sg1.ownstack.cn:8866/accounts', {
      accounts: allAccounts
  }).then((res: any) => {
      const group = lodash.groupBy(res.statusText, 'role');
      Object.keys(group).forEach(role => {
        if (role == 'Provider') {
          setOwnProviders(group[role])
        }
        if (role == 'Guarantor') {
          setOwnGuarantors(group[role])
        }
      })
    })
  }, [allAccounts])

  const porviderHeaderRef = useRef([
    [t('providers'), 'address'],
    [t('guarantors', 'address')],
    [t('total CSM'), 'number'],
    [t('total rewards'), 'number'],
    [t('pending rewards'), 'number'],
    [undefined, undefined, 2]
  ]);

  const guarantorHeaderRef = useRef([
    [t('guarantors'), 'address'],
    [t('provider'), 'address'],
    [t('total CSM'), 'number'],
    [t('total rewards'), 'number'],
    [t('pending rewards'), 'number'],
    [undefined, undefined, 2]
  ]);

  return (
    <div>
      <Button.Group>
        <NewDataGuarantor providers={providers} />
        <NewDataProvider providers={providers} />
        <NewBond />
      </Button.Group>
      {/* <div className={'comingsoon'}/> */}
      <Table
        empty={hasAccounts && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={porviderHeaderRef.current}
      >
        {ownProviders?.map((info): React.ReactNode => (
          <AccountProvider
            info={info}
            targets={accounts}
            providers={providers}
          />
        ))}
      </Table>

      <Table
        empty={hasAccounts && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={guarantorHeaderRef.current}
      >
        {ownGuarantors?.map((info): React.ReactNode => (
          <AccountGuarantor
            info={info}
            targets={accounts}
            providers={providers}
          />
        ))}
      </Table>
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
