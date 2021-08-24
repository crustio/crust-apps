// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegistryTypes } from '@polkadot/types/types';

export interface EthereumNetworkOptions {
  /**
   * Contract address of ChainBridge
   */
  bridge: string

  /**
   * Contract address of ERC-20 token
   */
  erc20: string

  /**
   * Contract address of ERC-20 asset handler
   */
  erc20AssetHandler: string

  /**
   * Resource Id of ERC-20 transfers
   */
  erc20ResourceId: string

  /**
   * Configured remote chain Ids
   */
  peerChainIds: Record<number | string, number>
}

export type EthereumNetworks = Record<string, Record<number, EthereumNetworkOptions>>

export interface SubstrateNetworkOptions {
  /**
   * WebSocket endpoint of Substrate node
   */
  endpoint: string

  /**
   * Configured remote chain Ids
   */
  peerChainIds: Record<number | string, number>

  /**
   * Type definitions of connected Substrate chain
   */
  typedefs: RegistryTypes
}

export type SubstrateNetwork = Record<string, SubstrateNetworkOptions>
