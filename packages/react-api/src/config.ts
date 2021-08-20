// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EthereumNetworkOptions } from './lib/configuration';

export const ethereums: Record<number, EthereumNetworkOptions> = {
  4: {
    bridge: '0x9B82DAF85E9dcC4409ed13970035a181fB411542',
    erc20: '0x002f24009df0c1e9215c98cec76f18d8eaf3db0f',
    erc20AssetHandler: '0x30BdFa99ddAe21a1Ee83e213Ff29121381DDEa54',
    erc20ResourceId:
      '0x000000000000000000000000000000608d1bc9a2d146ebc94667c336721b2801',
    peerChainIds: {
      'Crust Rocky': 1
    }
  },
  1: {
    bridge: '0xC84456ecA286194A201F844993C220150Cf22C63',
    erc20: '0x6c5ba91642f10282b576d91922ae6448c9d52f4e',
    erc20AssetHandler: '0x6eD3bc069Cf4F87DE05c04C352E8356492EC6eFE',
    erc20ResourceId:
      '0x00000000000000000000000000000063a7e2be78898ba83824b0c0cc8dfb6001',
    peerChainIds: {
      Crust: 1
    }
  }
};
