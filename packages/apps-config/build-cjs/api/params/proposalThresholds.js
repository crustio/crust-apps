"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFastTrackThreshold = getFastTrackThreshold;
exports.getProposalThreshold = getProposalThreshold;
exports.getSlashProposalThreshold = getSlashProposalThreshold;
exports.getTreasuryProposalThreshold = getTreasuryProposalThreshold;
var _constants = require("../constants");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// normal fast-track proposals
const FAST_TRACK = {
  default: 2 / 3
};

// in the case where block < fastTrackVotingPeriod
const FAST_TRACK_NO_DELAY = {
  default: 1
};
const PROPOSE = {
  [_constants.KULUPU_GENESIS]: 1,
  [_constants.KUSAMA_GENESIS]: 1 / 2,
  [_constants.POLKADOT_GENESIS]: 3 / 5,
  default: 1 / 2
};
const SLASH = {
  [_constants.KUSAMA_GENESIS]: 1 / 2,
  [_constants.POLKADOT_GENESIS]: 3 / 4,
  default: 1 / 2
};
const TREASURY = {
  [_constants.KULUPU_GENESIS]: 1 / 2,
  [_constants.KUSAMA_GENESIS]: 3 / 5,
  [_constants.POLKADOT_GENESIS]: 3 / 5,
  default: 3 / 5
};
function getFastTrackThreshold(api, isDefault) {
  return isDefault ? FAST_TRACK[api.genesisHash.toHex()] || FAST_TRACK.default : FAST_TRACK_NO_DELAY[api.genesisHash.toHex()] || FAST_TRACK_NO_DELAY.default;
}
function getProposalThreshold(api) {
  return PROPOSE[api.genesisHash.toHex()] || PROPOSE.default;
}
function getSlashProposalThreshold(api) {
  return SLASH[api.genesisHash.toHex()] || SLASH.default;
}
function getTreasuryProposalThreshold(api) {
  return TREASURY[api.genesisHash.toHex()] || TREASURY.default;
}