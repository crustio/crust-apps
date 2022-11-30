"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSs58 = createSs58;
var _networks = require("@polkadot/networks");
// Copyright 2017-2022 @polkadot/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

const networks = _networks.selectableNetworks.map(_ref => {
  let {
    displayName,
    network,
    prefix
  } = _ref;
  return {
    info: network,
    text: displayName,
    value: prefix
  };
}).sort((a, b) => [0, 2, 42].includes(a.value) || [0, 2, 42].includes(b.value) ? 0 : a.text.localeCompare(b.text));

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)

function createSs58(t) {
  return [{
    info: 'default',
    text: t('ss58.default', 'Default for the connected node', {
      ns: 'apps-config'
    }),
    value: -1
  }, ...networks];
}