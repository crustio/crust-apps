"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ethereumChains = require("./ethereumChains");
Object.keys(_ethereumChains).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ethereumChains[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ethereumChains[key];
    }
  });
});
var _languages = require("./languages");
Object.keys(_languages).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _languages[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _languages[key];
    }
  });
});
var _ss = require("./ss58");
Object.keys(_ss).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ss[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ss[key];
    }
  });
});