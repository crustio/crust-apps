"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identitySpec = exports.identityNodes = void 0;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// overrides based on the actual software node type, valid values are one of -
// polkadot, substrate, beachball, robohash

const identityNodes = [['centrifuge chain', 'polkadot'], ['joystream-node', 'beachball'], ['litentry-node', 'polkadot'], ['parity-polkadot', 'polkadot']].reduce((icons, _ref) => {
  let [node, icon] = _ref;
  return {
    ...icons,
    [node.toLowerCase().replace(/-/g, ' ')]: icon
  };
}, {});
exports.identityNodes = identityNodes;
const identitySpec = [['kusama', 'polkadot'], ['polkadot', 'polkadot'], ['rococo', 'polkadot'], ['statemine', 'polkadot'], ['statemint', 'polkadot'], ['westend', 'polkadot'], ['westmint', 'polkadot']].reduce((icons, _ref2) => {
  let [spec, icon] = _ref2;
  return {
    ...icons,
    [spec.toLowerCase().replace(/-/g, ' ')]: icon
  };
}, {});
exports.identitySpec = identitySpec;