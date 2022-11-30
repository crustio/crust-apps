"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  typesBundle: true
};
exports.typesBundle = void 0;
var _derives = require("./derives");
var _typesBundle = require("./typesBundle");
var _constants = require("./constants");
Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constants[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    }
  });
});
var _params = require("./params");
Object.keys(_params).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _params[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _params[key];
    }
  });
});
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const typesBundle = (0, _derives.applyDerives)(_typesBundle.typesBundle);
exports.typesBundle = typesBundle;