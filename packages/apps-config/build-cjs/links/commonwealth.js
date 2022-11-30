"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _logos = require("../ui/logos");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const HASH_PATHS = ['proposal/councilmotion'];
var _default = {
  chains: {
    Edgeware: 'edgeware',
    Kulupu: 'kulupu',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama'
  },
  create: (chain, path, data, hash) => `https://commonwealth.im/${chain}/${path}/${HASH_PATHS.includes(path) ? hash || '' : data.toString()}`,
  isActive: true,
  logo: _logos.externalLogos.commonwealth,
  paths: {
    council: 'proposal/councilmotion',
    proposal: 'proposal/democracyproposal',
    referendum: 'proposal/referendum',
    treasury: 'proposal/treasuryproposal'
  },
  url: 'https://commonwealth.im/'
};
exports.default = _default;