"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchJson = fetchJson;
exports.fetchText = fetchText;
var _xFetch = require("@polkadot/x-fetch");
// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

function fetchWithTimeout(url) {
  let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
  const controller = new AbortController();
  let id = null;

  // This is a weird mess, however we seem to have issues with Jest & hanging connections
  // in the case where things are (possibly) aborted. So we just swallow/log everything
  // and return null in the cases where things don't quite go as planned
  return Promise.race([(0, _xFetch.fetch)(url, {
    signal: controller.signal
  }).catch(error => {
    console.error(error);
    return null;
  }), new Promise(resolve => {
    id = setTimeout(() => {
      id = null;
      controller.abort();
      resolve(null);
    }, timeout);
  })]).then(response => {
    if (id) {
      clearTimeout(id);
    }
    return response;
  });
}
function fetchJson(url, timeout) {
  return fetchWithTimeout(url, timeout).then(r => r && r.json());
}
function fetchText(url, timeout) {
  return fetchWithTimeout(url, timeout).then(r => r && r.text());
}