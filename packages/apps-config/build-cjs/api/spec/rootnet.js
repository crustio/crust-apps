"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

const definitions = {
  types: [{
    // on all versions
    minmax: [0, undefined],
    types: {
      AccountId: 'EthereumAccountId',
      AccountId20: 'EthereumAccountId',
      AccountId32: 'EthereumAccountId',
      Address: 'AccountId',
      LookupSource: 'AccountId',
      Lookup0: 'AccountId',
      EthereumSignature: {
        r: 'H256',
        s: 'H256',
        v: 'U8'
      },
      ExtrinsicSignature: 'EthereumSignature'
    }
  }]
};
var _default = definitions;
exports.default = _default;