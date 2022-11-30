"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _inflation = require("./inflation");
Object.keys(_inflation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inflation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inflation[key];
    }
  });
});
var _proposalThresholds = require("./proposalThresholds");
Object.keys(_proposalThresholds).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _proposalThresholds[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _proposalThresholds[key];
    }
  });
});
var _teleport = require("./teleport");
Object.keys(_teleport).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _teleport[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _teleport[key];
    }
  });
});
var _tracks = require("./tracks");
Object.keys(_tracks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tracks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tracks[key];
    }
  });
});