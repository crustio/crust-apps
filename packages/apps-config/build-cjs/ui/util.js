"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitize = sanitize;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

function sanitize(value) {
  return (value == null ? void 0 : value.toLowerCase().replace(/-/g, ' ')) || '';
}