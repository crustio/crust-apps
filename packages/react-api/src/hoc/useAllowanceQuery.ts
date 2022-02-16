import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '../useEthers';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';
import { useErc20Contract } from './useErc20Contract';
import { ethereums } from '../config';
import { useApi } from '@polkadot/react-hooks';

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
  }, [bridge, network, address])

  return { allowance }
};
