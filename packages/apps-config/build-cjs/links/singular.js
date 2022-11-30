"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _logos = require("../ui/logos");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const getNetwork = _chain => {
  switch (_chain) {
    case 'statemine':
      return 'statemine/';
    default:
      return '';
  }
};
var _default = {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine'
  },
  create: (_chain, _path, data) => `https://singular.app/space/${getNetwork(_chain)}${data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.singular,
  paths: {
    address: 'account'
  },
  url: 'https://singular.app'
};
exports.default = _default;