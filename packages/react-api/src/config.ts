// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EthereumNetworkOptions } from './lib/configuration';

export const ethereums: Record<string, Record<number, EthereumNetworkOptions>> = {
  Crust: {
    1: {
      bridge: '0xbe92d90e943aEE3A79C645Cf3bad4c2511779125',
      erc20: '0x32a7C02e79c4ea1008dD6564b35F131428673c41',
      erc20AssetHandler: '0x18FCb27e4712AC11B8BecE851DAF96ba8ba34720',
      erc20ResourceId: '0x000000000000000000000000000000608d1bc9a2d146ebc94667c336721b2801',
      peerChainIds: {
        Crust: 1
      }
    }
  },
  'Crust Rocky': {
    4: {
      bridge: '0x9B82DAF85E9dcC4409ed13970035a181fB411542',
      erc20: '0x002f24009df0c1e9215c98cec76f18d8eaf3db0f',
      erc20AssetHandler: '0x30BdFa99ddAe21a1Ee83e213Ff29121381DDEa54',
      erc20ResourceId: '0x000000000000000000000000000000608d1bc9a2d146ebc94667c336721b2801',
      peerChainIds: {
        'Crust Rocky': 1
      }
    }
  },
  'Crust Maxwell': {
    1: {
      bridge: '0x0964A01E0d0B5d6FF726Ab9D60a93d188D3f505B',
      erc20: '0x32a7C02e79c4ea1008dD6564b35F131428673c41',
      erc20AssetHandler: '0x9D332427e6D1B91d9cf8d2fa3B41Df2012887aAB',
      erc20ResourceId: '0x000000000000000000000000000000608d1bc9a2d146ebc94667c336721b2801',
      peerChainIds: {
        'Crust Maxwell': 1
      }
    }
  }
};
