"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createWsEndpoints: true,
  CUSTOM_ENDPOINT_KEY: true
};
Object.defineProperty(exports, "CUSTOM_ENDPOINT_KEY", {
  enumerable: true,
  get: function () {
    return _development.CUSTOM_ENDPOINT_KEY;
  }
});
exports.createWsEndpoints = createWsEndpoints;
var _util = require("../util");
var _development = require("./development");
var _production = require("./production");
Object.keys(_production).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _production[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _production[key];
    }
  });
});
var _testing = require("./testing");
Object.keys(_testing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _testing[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _testing[key];
    }
  });
});
var _util2 = require("./util");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

function createWsEndpoints() {
  let t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _util.defaultT;
  let firstOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let withSort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return [{
    isDisabled: false,
    isHeader: true,
    isSpaced: true,
    text: t('rpc.header.live', 'Live networks', {
      ns: 'apps-config'
    }),
    textBy: '',
    value: ''
  }, ...(0, _util2.expandEndpoints)(t, _production.prodChains, firstOnly, withSort), {
    isDisabled: false,
    isHeader: true,
    text: t('rpc.header.test', 'Test networks', {
      ns: 'apps-config'
    }),
    textBy: '',
    value: ''
  }, ...(0, _util2.expandEndpoints)(t, _testing.testChains, firstOnly, withSort), {
    isDevelopment: true,
    isDisabled: false,
    isHeader: true,
    isSpaced: true,
    text: t('rpc.header.dev', 'Development', {
      ns: 'apps-config'
    }),
    textBy: '',
    value: ''
  }, ...(0, _development.createDev)(t), ...(0, _development.createOwn)(t)].filter(_ref => {
    let {
      isDisabled
    } = _ref;
    return !isDisabled;
  });
}