// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import type { ApiProps } from './types';

import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp';
import { StatusContext } from '@polkadot/react-components/Status';
import { useApiUrl, useEndpoint } from '@polkadot/react-hooks';
import { isNumber, objectSpread } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

import MainnetApiContext from './MainnetApiContext';
import registry from './typeRegistry';

interface Props {
  children: React.ReactNode;
  apiUrl: string;
  isElectron: boolean;
  store?: KeyringStore;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

let api: ApiPromise;

export { api };

function MainnetApi ({ apiUrl, children, isElectron, store }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  const apiEndpoint = useEndpoint(apiUrl);
  const relayUrls = useMemo(
    () => (apiEndpoint && apiEndpoint.valueRelay && isNumber(apiEndpoint.paraId) && (apiEndpoint.paraId < 2000))
      ? apiEndpoint.valueRelay
      : null,
    [apiEndpoint]
  );
  const apiRelay = useApiUrl(relayUrls);

  const value = useMemo<ApiProps>(
    () => objectSpread({}, { api, apiEndpoint, apiError, apiRelay, apiUrl, extensions, isApiConnected, isApiInitialized, isElectron, isWaitingInjected: !extensions }),
    [apiError, extensions, isApiConnected, isApiInitialized, isElectron, apiEndpoint, apiRelay, apiUrl]
  );

  // initial initialization
  useEffect((): void => {
    const provider = new WsProvider(apiUrl);

    api = new ApiPromise({ provider, typesBundle: typesBundleForPolkadot });

    api.on('connected', () => setIsApiConnected(true));
    api.on('disconnected', () => setIsApiConnected(false));
    api.on('error', (error: Error) => setApiError(error.message));
    api.on('ready', (): void => {
      const injectedPromise = web3Enable('polkadot-js/apps');

      injectedPromise
        .then(setExtensions)
        .catch(console.error);
    });

    setIsApiInitialized(true);
  }, [apiEndpoint, apiUrl, queuePayload, queueSetTxStatus, store]);

  if (!value.isApiInitialized) {
    return null;
  }

  return (
    <MainnetApiContext.Provider value={value}>
      {children}
    </MainnetApiContext.Provider>
  );
}

export default React.memo(MainnetApi);
