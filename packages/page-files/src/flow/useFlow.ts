// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import * as fcl from "@onflow/fcl";
import { FlowM } from './types';

export function useFlow (): FlowM {
  const [flow, setFlow] = useState<FlowM>({ isLoad: true});

  useEffect(() => {
    void (async function () {

      fcl.config()
        .put("env", "testnet")
        .put("accessNode.api", "https://access-testnet.onflow.org")
        .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/api/flow/authn")
        // .put("env", "mainnet")
        // .put("accessNode.api", "https://flow-access-mainnet.portto.io")
        // .put("discovery.wallet", "https://flow-wallet.blocto.app/authn")
        .put("challenge.scope", "email") // request for Email
        .put("discovery.wallet.method", "HTTP/POST")
        .put("service.OpenID.scopes", "email!");

      setFlow({ isLoad: false });
    })();
  }, []);

  return flow;
}
