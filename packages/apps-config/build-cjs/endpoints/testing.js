"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  testChains: true
};
exports.testChains = void 0;
var _testingRelayRococo = require("./testingRelayRococo");
Object.keys(_testingRelayRococo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _testingRelayRococo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _testingRelayRococo[key];
    }
  });
});
var _testingRelayWestend = require("./testingRelayWestend");
Object.keys(_testingRelayWestend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _testingRelayWestend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _testingRelayWestend[key];
    }
  });
});
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
const testChains = [{
  info: 'crust-rocky',
  text: 'Crust Rocky',
  providers: {
    'Crust Network': 'wss://rpc-rocky.crust.network'
  }
}];
exports.testChains = testChains;