// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Table } from '@polkadot/react-components';
import LuckyEasterOrders from './LuckyEasterOrders';
import PreviousOrders from './PreviousOrders';
import { EasterEggsOrder } from '../Overview/types';
import { httpGet } from './http';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  isLoading: boolean;
}


function EasterEggsOrders ({ isLoading }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // we have a very large list, so we use a loading delay
  // const [nameFilter, setNameFilter] = useState<string>('');
  const [currentList, setCurrentList] = useState<EasterEggsOrder>({
    date: new Date().getTime(),
    orders: []
  });

  const [previousList, setPreviousList] = useState<EasterEggsOrder[]>([]);

  useEffect(() => {
    httpGet('http://localhost:12345/currentList').then((res: { code: number; statusText: React.SetStateAction<EasterEggsOrder>; }) => {
      if (res.code === 200) {
        setCurrentList(res.statusText)
      }
    })
  }, []);

  useEffect(() => {
    httpGet('http://localhost:12345/previousList').then((res: { code: number; statusText: React.SetStateAction<EasterEggsOrder[]> }) => {
      if (res.code === 200) {
        setPreviousList(res.statusText)
      }
    })
  }, [])

  const headerRef = useRef([
    [t('cid'), 'start'],
    [t('size')],
    [t('merchants')]
  ]);

  const preHeaderRef = useRef([
    [t('date'), 'start'],
    [t('orders')],
  ]);

  return (<>
    <h1>
        {t<string>('Today lucky orders')}
    </h1>
    <Table
      header={headerRef.current}
      empty={!isLoading && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
    >
        {!isLoading && currentList.orders?.map((order): React.ReactNode => (
          <LuckyEasterOrders
            info={order}
          />
        ))}

    </Table>
    <h1>
        {t<string>('Previous lucky orders')}
    </h1>
    <Table
      header={preHeaderRef.current}
      empty={!isLoading && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
    >
        {!isLoading && previousList?.map((order): React.ReactNode => (
          <PreviousOrders
            info={order}
          />
        ))}

    </Table>
  </>
  );
}

export default React.memo(styled(EasterEggsOrders)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
