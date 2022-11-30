"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _logos = require("../ui/logos");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const getNetwork = _chain => {
  const chain = _chain === 'kusama' ? 'rmrk' : _chain;
  return `https://kodadot.xyz/${chain}/u/`;
};
var _default = {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine',
    Westend: 'westend',
    Westmint: 'westmint'
  },
  create: (_chain, _path, data) => `${getNetwork(_chain)}${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.kodadot,
  paths: {
    address: 'account'
  },
  url: 'https://kodadot.xyz'
};
exports.default = _default;