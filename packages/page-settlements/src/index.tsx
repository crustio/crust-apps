// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// import { useTranslation } from '@polkadot/apps/translate';
import { useApi, useCall } from '@polkadot/react-hooks';

const Settlements:React.FC = () => {
  // const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const files = useCall(isApiReady && api.query?.market && api.query?.market.files.entries, []);

  console.log(JSON.stringify(files));

  return <div>settlements</div>;
};

export default Settlements;
