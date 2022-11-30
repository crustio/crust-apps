"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _logos = require("../ui/logos");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
var _default = {
  chains: {
    // Kulupu: 'kulupu',
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Rococo: 'rococo'
  },
  create: (chain, path, data) => `https://polkascan.io/${chain}/${path}/${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.polkascan,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council/motion',
    extrinsic: 'transaction',
    proposal: 'democracy/proposal',
    referendum: 'democracy/referendum',
    techcomm: 'techcomm/proposal',
    treasury: 'treasury/proposal'
  },
  url: 'https://polkascan.io/'
};
exports.default = _default;