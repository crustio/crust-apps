"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typesFromDefs = typesFromDefs;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

function typesFromDefs(definitions) {
  return Object.values(definitions).reduce((res, _ref) => {
    let {
      types
    } = _ref;
    return {
      ...res,
      ...types
    };
  }, {});
}