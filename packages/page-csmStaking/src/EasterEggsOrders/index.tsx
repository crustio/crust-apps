// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Table } from '@polkadot/react-components';
import PreviousOrders from './PreviousOrders';
import { EasterEggsOrder } from '../Overview/types';
import { httpGet } from './http';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
  isLoading: boolean;
}


function EasterEggsOrders ({ isLoading }: Props): React.ReactElement<Props> {
  const { t, i18n } = useTranslation();
  // we have a very large list, so we use a loading delay
  // const [nameFilter, setNameFilter] = useState<string>('');
  const [currentList, setCurrentList] = useState<EasterEggsOrder>({
    date: new Date().getTime(),
    orders: []
  });

  const [previousList, setPreviousList] = useState<EasterEggsOrder[]>([]);

  useEffect(() => {
    httpGet('https://lder-api.crust.network/currentList').then((res: { code: number; statusText: React.SetStateAction<EasterEggsOrder>; }) => {
      if (res.code === 200) {
        setCurrentList(res.statusText)
      }
    })
  }, []);

  useEffect(() => {
    httpGet('https://lder-api.crust.network/previousList').then((res: { code: number; statusText: React.SetStateAction<EasterEggsOrder[]> }) => {
      if (res.code === 200 && currentList) {
        const orders = [currentList]
        setPreviousList(orders.concat(res.statusText as []))
      }
    })
  }, [currentList])

  const preHeaderRef = useRef([
    [t('date'), 'start'],
    [t('orders')],
  ]);

  return (<>
    <h3 style={{ "textAlign": 'center' }}>
      <span style={{ "wordWrap": "break-word", "wordBreak": "break-all", float: "right", 'display': 'inline-block' }}><span style={{ 'fontWeight': 'bold', fontSize: '16px' }}>
        <a href={i18n.language == 'zh' ? 'https://www.yuque.com/qm003f/cr9w38/cldb5y' : 'https://medium.com/crustnetwork/tutorial-exit-the-maxwell-preview-network-lucky-order-rewards-78cbf3d36639'} target="_blank">
          {t<string>(`How to get lucky order reward >>`)}</a>
      </span>
      
      </span>
    </h3>
    {/* <h1>
      {t<string>('Today lucky orders')}
    </h1>
    <Table
      header={headerRef.current}
      empty={!isLoading && t<string>('No funds lucky orders yet.')}
    >
        {!isLoading && currentList.orders?.map((order): React.ReactNode => (
          <LuckyEasterOrders
            key={order.cid}
            info={order}
          />
        ))}

    </Table> */}
    <h1>
        {t<string>('Previous lucky orders')}
    </h1>
    <Table
      header={preHeaderRef.current}
      empty={!isLoading && t<string>('No funds lucky orders yet.')}
    >
        {!isLoading && previousList?.map((order): React.ReactNode => (
          <PreviousOrders
            key={order.date}
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
