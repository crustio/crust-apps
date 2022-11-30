"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDerives = applyDerives;
var _equilibrium = _interopRequireDefault(require("./spec/equilibrium"));
var _genshiro = _interopRequireDefault(require("./spec/genshiro"));
var _interbtc = _interopRequireDefault(require("./spec/interbtc"));
var _subspace = _interopRequireDefault(require("./spec/subspace"));
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const mapping = [[_equilibrium.default, ['Equilibrium']], [_genshiro.default, ['Genshiro', 'Genshiro Rococo Testnet']], [_interbtc.default, ['interbtc-parachain', 'interbtc-standalone', 'interlay-parachain', 'kintsugi-parachain', 'testnet-kintsugi', 'testnet-interlay']], [_subspace.default, ['subspace']]];
function applyDerives(typesBundle) {
  mapping.forEach(_ref => {
    let [{
      derives
    }, chains] = _ref;
    chains.forEach(chain => {
      if (typesBundle.spec && typesBundle.spec[chain]) {
        typesBundle.spec[chain].derives = derives;
      }
    });
  });
  return typesBundle;
}