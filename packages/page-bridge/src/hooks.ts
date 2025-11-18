// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from "bn.js";
import { ethers } from "ethers";
import React from "react";

import { BN_ZERO } from "@polkadot/util";

import { abi } from "./contractAbi";
import { random } from "lodash";

const pubRpcurls: string[] = [
  "https://rpc.mevblocker.io/fast",
  "https://api.zan.top/eth-mainnet",
  "https://1rpc.io/eth",
  "https://eth.rpc.blxrbdn.com",
  "https://ethereum-rpc.publicnode.com",
  "https://rpc.flashbots.net",
  "https://eth.meowrpc.com",
  "https://eth.drpc.org",
  
];
const contractAddress = "0x32a7C02e79c4ea1008dD6564b35F131428673c41";
const handler = "0x18FCb27e4712AC11B8BecE851DAF96ba8ba34720";

export function useEthBridgeBalance() {
  const [balance, setBalance] = React.useState<BN>(BN_ZERO);
  React.useEffect(() => {
    async function fetchBalance() {
      while (true) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(pubRpcurls[random(0, pubRpcurls.length - 1)]);
          const erc20Contract = new ethers.Contract(contractAddress, abi, provider);
          const res = await erc20Contract.getBalance(handler);
          setBalance(new BN((Number(res) / 1000000.0).toString()));
          break;
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }
    }
    fetchBalance();
  }, []);

  return balance;
}
