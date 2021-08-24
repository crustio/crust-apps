// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useApi } from '@polkadot/react-hooks';
import { Contract, ethers } from 'ethers';
import { useMemo } from 'react';

import { ethereums } from '../config';
import { useEthers } from '../useEthers';
// @ts-ignore
import abi from './Erc20HandlerAbi.json';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';

export const useErc20HandlerInterface = (
  addressOrName?: string
): { contract?: Contract; instance?: string } => {
  const { signer } = useEthers();
  const { data: network } = useEthersNetworkQuery();
  const chainId = network?.chainId;
  const { systemChain: substrateName } = useApi();

  return useMemo(() => {
    const handler =
      addressOrName ?? ethereums[substrateName][chainId as number]?.erc20AssetHandler;

    if (handler === undefined || signer === undefined) {
      return {};
    }

    return {
      contract: new ethers.Contract(handler, abi, signer)
    };
  }, [addressOrName, chainId, signer]);
};
