"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.availableExtensions = void 0;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The list of known extensions including the links to tem on the store. This is used when
// no extensions are actually available, promoting the user to install one or more
// (Any known extension can and should be added here)

const known = [{
  all: {
    chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
  },
  desc: 'Basic account injection and signer',
  name: 'polkadot-js extension'
}];
const availableExtensions = known.reduce((available, _ref) => {
  let {
    all,
    desc,
    name
  } = _ref;
  Object.entries(all).forEach(_ref2 => {
    let [browser, link] = _ref2;
    available[browser].push({
      desc,
      link,
      name
    });
  });
  return available;
}, {
  chrome: [],
  firefox: []
});
exports.availableExtensions = availableExtensions;