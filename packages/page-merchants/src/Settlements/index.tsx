// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { SettlementItem } from '@polkadot/apps-merchants/Settlements/settlementList';

import { fetchFileTobeClaimed } from './fetch';
import SettlementList from './settlementList';

// import { useTranslation } from '@polkadot/apps/translate';

const Settlements:React.FC = () => {
  // const { t } = useTranslation();
  const [settlements, setSettlements] = useState<SettlementItem[]>([]);

  useEffect(() => {
    fetchFileTobeClaimed().then((res) => {
      setSettlements(res as SettlementItem[]);
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return <div><SettlementList settlementList={settlements}/></div>;
};

export default Settlements;
