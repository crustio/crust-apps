// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { ethereums } from '../config';
import { useEthers } from '../useEthers';
import { useErc20Contract } from './useErc20Contract';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';

export const useAllowanceQuery = (address?: string) => {
  const { contract } = useErc20Contract();
  const { data: network } = useEthersNetworkQuery();
  const { provider } = useEthers();
  const [allowance, setAllowance] = useState<number>();
  const chainId = network?.chainId;
  const { systemChain: substrateName } = useApi();

  const bridge = useMemo(() => {
    return contract !== undefined && provider !== undefined
      ? contract
      : undefined;
  }, [contract, provider]);

  useEffect(() => {
    const erc20AssetHandler = (typeof chainId === 'number' ? ethereums[substrateName][chainId]?.erc20AssetHandler : undefined);

    if (bridge && address && erc20AssetHandler) {
      bridge.allowance(address, erc20AssetHandler).then((res: any) => setAllowance(Number(ethers.utils.formatEther(res))));
    }
  }, [bridge, network, address]);

  return { allowance };
};
