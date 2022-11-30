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
    Litentry: 'litentry',
    Litmus: 'litmus',
    Statemine: 'statemine',
    Westmint: 'westmint'
  },
  create: (chain, path, data) => `https://${chain}.statescan.io/${path}/${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.statescan,
  paths: {
    address: 'account',
    block: 'block'
  },
  url: 'https://statescan.io/'
};
exports.default = _default;