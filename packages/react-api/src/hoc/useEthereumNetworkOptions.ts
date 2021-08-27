// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useApi } from '@polkadot/react-hooks';
import { useMemo } from 'react';

import { ethereums } from '../config';
import { EthereumNetworkOptions } from '../lib/configuration';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';

type UseEthereumNetworkOptionsResult = {
  // TODO: use type guard?
  error?: Error
  options?: EthereumNetworkOptions
}

class NetworkNotReadyError extends Error {
  constructor () {
    super('Ethereum network is not connected');
  }
}

class NetworkUndefinedError extends Error {
  public readonly chainId?: number

  public readonly networkName?: string

  constructor (chainId: number, name?: string) {
    super(
      `Connected Ethereum network is not supported: ${name ?? ''} (${chainId})`
    );
    this.chainId = chainId;
    this.networkName = name;
  }
}

/**
 * @param chainId Chain Id of destination Ethereum network (e.g Kovan for 42)
 */
export const useEthereumNetworkOptions = (
  chainId?: number
): UseEthereumNetworkOptionsResult => {
  const { data: network } = useEthersNetworkQuery();
  const { systemChain: substrateName } = useApi();

  chainId = chainId ?? network?.chainId;

  return useMemo<UseEthereumNetworkOptionsResult>(() => {
    if (typeof chainId !== 'number') {
      return {
        error: new NetworkNotReadyError()
      };
    }

    const result = ethereums[substrateName][chainId];

    if (result !== undefined) {
      return { options: result };
    } else {
      return {
        error: new NetworkUndefinedError(
          chainId,
          chainId === network?.chainId ? network.name : undefined
        )
      };
    }
  }, [chainId, network?.chainId, network?.name]);
};
