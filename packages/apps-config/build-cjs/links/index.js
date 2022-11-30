"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.externalLinks = void 0;
var _commonwealth = _interopRequireDefault(require("./commonwealth"));
var _dotreasury = _interopRequireDefault(require("./dotreasury"));
var _dotscanner = _interopRequireDefault(require("./dotscanner"));
var _kodadot = _interopRequireDefault(require("./kodadot"));
var _polkaholic = _interopRequireDefault(require("./polkaholic"));
var _polkascan = _interopRequireDefault(require("./polkascan"));
var _polkassembly = require("./polkassembly");
var _polkastats = _interopRequireDefault(require("./polkastats"));
var _singular = _interopRequireDefault(require("./singular"));
var _statescan = _interopRequireDefault(require("./statescan"));
var _subid = _interopRequireDefault(require("./subid"));
var _subscan = _interopRequireDefault(require("./subscan"));
var _subsquare = _interopRequireDefault(require("./subsquare"));
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const externalLinks = {
  Commonwealth: _commonwealth.default,
  DotScanner: _dotscanner.default,
  Dotreasury: _dotreasury.default,
  KodaDot: _kodadot.default,
  Polkaholic: _polkaholic.default,
  Polkascan: _polkascan.default,
  PolkassemblyIo: _polkassembly.PolkassemblyIo,
  PolkassemblyNetwork: _polkassembly.PolkassemblyNetwork,
  Polkastats: _polkastats.default,
  'Singular (NFTs)': _singular.default,
  Statescan: _statescan.default,
  SubId: _subid.default,
  Subscan: _subscan.default,
  Subsquare: _subsquare.default
};
exports.externalLinks = externalLinks;