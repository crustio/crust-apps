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
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Westend: 'westend'
  },
  create: (chain, path, data) => `https://${chain}.polkastats.io/${path}/${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.polkastats,
  paths: {
    address: 'account',
    block: 'block',
    extrinsic: 'extrinsic',
    intention: 'intention',
    validator: 'validator'
  },
  url: 'https://polkastats.io/'
};
exports.default = _default;