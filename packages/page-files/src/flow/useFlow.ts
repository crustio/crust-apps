// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { FlowM } from './types';

// eslint-disable-next-line
const fcl = require('@onflow/fcl');

export function useFlow (): FlowM {
  const [flow, setFlow] = useState<FlowM>({ isLoad: true });

  useEffect(() => {
    // eslint-disable-next-line
    fcl.config()
      .put('accessNode.api', 'https://flow-access-mainnet.portto.io')
      .put('challenge.handshake', 'https://flow-wallet.blocto.app/authn');

    setFlow({ isLoad: false });
  }, []);

  return flow;
}
