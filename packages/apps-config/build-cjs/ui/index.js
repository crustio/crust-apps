"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getSystemIcon: true,
  getSystemColor: true
};
exports.getSystemColor = getSystemColor;
exports.getSystemIcon = getSystemIcon;
var _colors = require("./colors");
var _identityIcons = require("./identityIcons");
var _util = require("./util");
var _logos = require("./logos");
Object.keys(_logos).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _logos[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _logos[key];
    }
  });
});
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

function getSystemIcon(systemName, specName) {
  return _identityIcons.identityNodes[(0, _util.sanitize)(systemName)] || _identityIcons.identitySpec[(0, _util.sanitize)(specName)] || 'substrate';
}
function getSystemColor(systemChain, systemName, specName) {
  return _colors.chainColors[(0, _util.sanitize)(systemChain)] || _colors.nodeColors[(0, _util.sanitize)(systemName)] || _colors.specColors[(0, _util.sanitize)(specName)];
}