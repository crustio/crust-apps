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
    Kusama: 'ksm',
    Polkadot: 'dot'
  },
  create: (chain, path, data) => `https://www.dotreasury.com/${chain}/${path}/${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.dotreasury,
  paths: {
    bounty: 'bounties',
    tip: 'tips',
    treasury: 'proposals'
  },
  url: 'https://dotreasury.com/'
};
exports.default = _default;