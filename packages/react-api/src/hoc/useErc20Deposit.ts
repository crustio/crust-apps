// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigNumber, ethers } from 'ethers';
import { isHexString } from 'ethers/lib/utils';
import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { useEthers } from '../useEthers';
import { useBridgeContract } from './useBridgeContract';
import { useEthereumNetworkOptions } from './useEthereumNetworkOptions';
import { useEthersNetworkQuery } from './useEthersNetworkQuery';

type DepositSubmitFn = (
  amount: BigNumber,
  recipient: string
) => Promise<ethers.providers.TransactionResponse> // TODO: use HexString

/**
 * Submits a transfer of ERC-20 tokens from Ethereum to Substrate
 */
export const useErc20Deposit = (
  sender?: string
): DepositSubmitFn | undefined => {
  const { contract } = useBridgeContract();
  const { systemChain: substrateName } = useApi();
  const { options: config } = useEthereumNetworkOptions();
  const { data: network } = useEthersNetworkQuery();
  const { provider } = useEthers();

  const bridge = useMemo(() => {
    return contract !== undefined && provider !== undefined
      ? contract.connect(provider.getSigner(sender))
      : undefined;
  }, [contract, provider, sender]);

  return useMemo(() => {
    if (
      bridge === undefined ||
      config === undefined ||
      network === undefined ||
      sender === undefined ||
      substrateName === undefined
    ) {
      return undefined;
    }

    const destChainId = config.peerChainIds[substrateName] as
      | number
      | undefined;

    return async (amount, recipient) => {
      if (destChainId === undefined) {
        throw new Error(
          `Unsupported Ethereum network: ${network.name} (${network.chainId})`
        );
      }

      if (typeof bridge.functions.deposit !== 'function') {
        throw new Error(
          'Assertion failed: deposit should be available on the bridge contract'
        );
      }

      if (!isHexString(recipient)) {
        throw new Error('Validation failed: recipient should be hex string');
      }

      const amountPayload = ethers.utils
        .hexZeroPad(amount.toHexString(), 32)
        .substr(2);
      const recipientPayload = recipient.substr(2);
      const recipientSize = ethers.utils
        .hexZeroPad(ethers.utils.hexlify(recipientPayload.length / 2), 32)
        .substr(2);

      const payload = `0x${amountPayload}${recipientSize}${recipientPayload}`;

      return await (bridge.functions.deposit(
        destChainId,
        config.erc20ResourceId,
        payload
      ) as Promise<ethers.providers.TransactionResponse>);
    };
  }, [bridge, config, network, sender, substrateName]);
};
