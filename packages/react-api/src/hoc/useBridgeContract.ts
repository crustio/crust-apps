// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useApi } from '@polkadot/react-hooks';
import { Contract, ethers } from 'ethers';
import { useMemo } from 'react';

import { ethereums } from '../config';
import { useEthers } from '../useEthers';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';

const { v4 } = require('uuid');

export const BridgeInterface = [
  'event Deposit(uint8 destinationChainID, bytes32 resourceID, uint64 depositNonce)',
  'function deposit(uint8 destinationChainID, bytes32 resourceID, bytes calldata data)'
];

export const useBridgeContract = (
  addressOrName?: string
): { contract?: Contract; instance?: string } => {
  const { signer } = useEthers();
  const { data: network } = useEthersNetworkQuery();
  const chainId = network?.chainId;
  const { systemChain: substrateName } = useApi();

  return useMemo(() => {
    const bridge =
      addressOrName ??
      (typeof chainId === 'number' ? ethereums[substrateName][chainId]?.bridge : undefined);

    if (bridge === undefined || signer === undefined) {
      return {};
    }

    return {
      contract: new ethers.Contract(bridge, BridgeInterface, signer),
      instance: v4()
    };
  }, [addressOrName, chainId, signer]);
};
