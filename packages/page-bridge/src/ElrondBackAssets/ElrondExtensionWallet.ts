// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Address, Transaction, TransactionPayload } from '@elrondnetwork/erdjs';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';

const networkProvider = new ProxyNetworkProvider('https://gateway.elrond.com', { timeout: 30000 });

const ElrondBridgePoolAddress = 'erd1drg6ndpqv3wvn0pu90al2magq7cwzar72sa6x0aws9wu9caz8wds99hqxt';

export class ElrondExtensionWallet {
  isInit = false;
  provider: ExtensionProvider;
  constructor () {
    this.provider = ExtensionProvider.getInstance();
  }

  async signTransactions (data: any) {
    try {
      await this.provider.init();
      await this.provider.login();

      const tx = new Transaction({
        value: '0',
        receiver: new Address(ElrondBridgePoolAddress),
        gasLimit: 500000,
        data: new TransactionPayload(data),
        chainID: '1'
      });

      await this.provider.signTransaction(tx);

      await networkProvider.sendTransaction(tx);

      return true;
    } catch (error) {
      console.log('error: ', error);

      return false;
    }
  }
}
