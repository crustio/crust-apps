"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  prodChains: true
};
exports.prodChains = void 0;
var _productionRelayKusama = require("./productionRelayKusama");
Object.keys(_productionRelayKusama).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _productionRelayKusama[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _productionRelayKusama[key];
    }
  });
});
var _productionRelayPolkadot = require("./productionRelayPolkadot");
Object.keys(_productionRelayPolkadot).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _productionRelayPolkadot[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _productionRelayPolkadot[key];
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
const prodChains = [{
  info: 'crust',
  text: 'Crust Network',
  providers: {
    'Crust Network': 'wss://crust-main.crust.network',
    OnFinality: 'wss://crust-main.api.onfinality.io/public-ws',
    'DCloud Foundation': 'wss://crust-main.dcf.network/public-ws'
  }
}, {
  info: 'shadow',
  text: 'Crust Shadow',
  providers: {
    'Crust Network': 'wss://rpc2-shadow.crust.network'
  }
}, {
  info: 'crustParachain',
  text: 'Crust Parachain',
  providers: {
    'Crust Network': 'wss://para-crust.crust.network'
  }
}];
exports.prodChains = prodChains;