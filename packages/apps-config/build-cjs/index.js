"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _api = require("./api");
Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});
var _endpoints = require("./endpoints");
Object.keys(_endpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _endpoints[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _endpoints[key];
    }
  });
});
var _extensions = require("./extensions");
Object.keys(_extensions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extensions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extensions[key];
    }
  });
});
var _links = require("./links");
Object.keys(_links).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _links[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _links[key];
    }
  });
});
var _settings = require("./settings");
Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});
var _ui = require("./ui");
Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ui[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui[key];
    }
  });
});
var _ipfsGatewayEndpoints = require("./ipfs-gateway-endpoints");
Object.keys(_ipfsGatewayEndpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ipfsGatewayEndpoints[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ipfsGatewayEndpoints[key];
    }
  });
});