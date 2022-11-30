"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _definitions = require("@subsocial/definitions/interfaces/subsocial/definitions");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// IMPORTANT
//
// We only load the definitions here explicitly - if we try to go via
//   import { types } from '@subsocial/types';
// we end up with multiple version of types/API since it uses CJS,
// therefore here we explicitly import from the definitions (as re-exported)
// KEEP, see above
var _default = {
  types: _definitions.types
};
exports.default = _default;