import type { ethers } from 'ethers';
import { useQuery, UseQueryResult } from 'react-query'
import { useEthers } from '../useEthers';
const { v4 } = require('uuid');

const EthersNetworkQueryKey = v4();

export const useEthersNetworkQuery = (): UseQueryResult<ethers.providers.Network> => {
  const { instance, provider } = useEthers();

  return useQuery(
    [EthersNetworkQueryKey, provider?.network, instance],
    async () => await provider?.getNetwork()
  )
}
