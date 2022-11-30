"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTeleportWeight = getTeleportWeight;
var _constants = require("../constants");
// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// 4 * BaseXcmWeight on Kusama
const KUSAMA_WEIGHT = 4 * 1000000000;
const DEFAULT_WEIGHT = KUSAMA_WEIGHT;
const KNOWN_WEIGHTS = {
  [_constants.KUSAMA_GENESIS]: KUSAMA_WEIGHT
};
function getTeleportWeight(api) {
  return KNOWN_WEIGHTS[api.genesisHash.toHex()] || DEFAULT_WEIGHT;
}