// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React from 'react';

import SettleModalMaxwell from '@polkadot/apps-merchants/Settlements/settle-modal/SettleModal';
import SettleModalMainnet from '@polkadot/apps-merchants/Settlements/settle-modal/SettleModalMainnet';
import { useApi } from '@polkadot/react-hooks';

const SettleModal = (props: any) => {
  const { systemChain } = useApi();
  const isMaxwell = systemChain === 'Crust Maxwell';

  if (isMaxwell) {
    return <SettleModalMaxwell {...props}/>;
  } else {
    return <SettleModalMainnet {...props}/>;
  }
};

export default SettleModal;
