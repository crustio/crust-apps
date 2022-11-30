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
    Polkadot: 'polkadot'
  },
  create: (chain, path, data) => `https://dotscanner.com/${chain}/${path}/${data.toString()}?utm_source=polkadotjs`,
  isActive: true,
  logo: _logos.externalLogos.dotscanner,
  paths: {
    address: 'account',
    block: 'block'
  },
  url: 'https://dotscanner.com/'
};
exports.default = _default;