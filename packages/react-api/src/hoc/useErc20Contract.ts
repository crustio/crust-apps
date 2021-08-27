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

const contractInterface = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)'
];

export const useErc20Contract = (
  addressOrName?: string
): { contract?: Contract; instance?: string } => {
  const { signer } = useEthers();
  const { data: network } = useEthersNetworkQuery();
  const chainId = network?.chainId;
  const { systemChain: substrateName } = useApi();

  return useMemo(() => {
    const erc20 =
      addressOrName ??
      (typeof chainId === 'number' ? ethereums[substrateName][chainId]?.erc20 : undefined);

    if (erc20 === undefined || signer === undefined) {
      return {};
    }

    return {
      contract: new ethers.Contract(erc20, contractInterface, signer),
      instance: v4()
    };
  }, [addressOrName, chainId, signer]);
};
