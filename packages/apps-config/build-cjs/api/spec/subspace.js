"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rxjs = require("rxjs");
var _chain = require("@polkadot/api-derive/chain");
var _util = require("@polkadot/api-derive/util");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

function extractAuthor(digest, api) {
  const preRuntimes = digest.logs.filter(log => log.isPreRuntime && log.asPreRuntime[0].toString() === 'SUB_');
  if (!preRuntimes || preRuntimes.length === 0) {
    return undefined;
  }
  const {
    solution
  } = api.registry.createType('SubPreDigest', preRuntimes[0].asPreRuntime[1]);
  return solution.reward_address;
}
function createHeaderExtended(registry, header, api) {
  const HeaderBase = registry.createClass('Header');
  class SubHeaderExtended extends HeaderBase {
    #author;
    constructor(registry, header, api) {
      super(registry, header);
      this.#author = extractAuthor(this.digest, api);
      this.createdAtHash = header == null ? void 0 : header.createdAtHash;
    }
    get author() {
      return this.#author;
    }
  }
  return new SubHeaderExtended(registry, header, api);
}
function subscribeNewHeads(instanceId, api) {
  return (0, _util.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.rpc.chain.subscribeNewHeads()]).pipe((0, _rxjs.map)(_ref => {
    let [header] = _ref;
    return createHeaderExtended(header.registry, header, api);
  })));
}
function getHeader(instanceId, api) {
  return (0, _util.memo)(instanceId, blockHash => (0, _rxjs.combineLatest)([api.rpc.chain.getHeader(blockHash)]).pipe((0, _rxjs.map)(_ref2 => {
    let [header] = _ref2;
    return createHeaderExtended(header.registry, header, api);
  })));
}
const definitions = {
  derives: {
    chain: {
      bestNumber: _chain.bestNumber,
      bestNumberFinalized: _chain.bestNumberFinalized,
      bestNumberLag: _chain.bestNumberLag,
      getBlock: _chain.getBlock,
      getHeader,
      subscribeNewBlocks: _chain.subscribeNewBlocks,
      subscribeNewHeads
    }
  },
  types: [{
    minmax: [0, undefined],
    types: {
      Solution: {
        public_key: 'AccountId32',
        reward_address: 'AccountId32'
      },
      SubPreDigest: {
        slot: 'u64',
        solution: 'Solution'
      }
    }
  }]
};
var _default = definitions;
exports.default = _default;