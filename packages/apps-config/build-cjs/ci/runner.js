"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkEndpoints = checkEndpoints;
var _fs = _interopRequireDefault(require("fs"));
var _api = require("@polkadot/api");
var _util = require("@polkadot/util");
var _api2 = require("../api");
var _endpoints = require("../endpoints");
var _fetch = require("./fetch");
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const TICK = '`';
function createChecker(issueFile, failures) {
  return async (name, ws) => {
    const [,, hostWithPort] = ws.split('/');
    const [host] = hostWithPort.split(':');
    const json = await (0, _fetch.fetchJson)(`https://dns.google/resolve?name=${host}`);
    let provider = null;
    let api = null;
    let timerId = null;
    let isOk = true;
    try {
      (0, _util.assert)(json && json.Answer, `No DNS entry for ${host}`);
      provider = new _api.WsProvider(ws, false);
      api = new _api.ApiPromise({
        provider,
        throwOnConnect: true,
        throwOnUnknown: false,
        typesBundle: _api2.typesBundle
      });
      setTimeout(() => {
        provider && provider.connect().catch(() => undefined);
      }, 1000);
      await Promise.race([
      // eslint-disable-next-line promise/param-names
      new Promise((_, reject) => {
        timerId = setTimeout(() => {
          timerId = null;
          reject(new Error(`Timeout connecting to ${ws}`));
        }, 30000);
      }), api.isReadyOrError.then(a => a.rpc.chain.getBlock()).then(b => console.log(`>>> ${name} @ ${ws}`, b.toHuman()))]);
    } catch (error) {
      if ((0, _util.isError)(error) && failures.some(f => error.message.includes(f))) {
        process.env.CI_LOG && _fs.default.appendFileSync(issueFile, `\n${TICK}${name} @ ${ws} ${error.message}${TICK}\n`);
        isOk = false;
      }
      console.error(JSON.stringify(error));
    } finally {
      if (timerId) {
        clearTimeout(timerId);
      }
      if (provider) {
        try {
          if (api) {
            await api.disconnect();
          } else {
            await provider.disconnect();
          }
        } catch {
          // ignore
        }
      }
    }
    return isOk;
  };
}
function checkEndpoints(issueFile, failures) {
  const checker = createChecker(issueFile, failures);
  it.each((0, _endpoints.createWsEndpoints)().filter(_ref => {
    let {
      isDisabled,
      isUnreachable,
      value
    } = _ref;
    return !isDisabled && !isUnreachable && value && (0, _util.isString)(value) && !value.includes('127.0.0.1') && !value.startsWith('light://');
  }).map(_ref2 => {
    let {
      text,
      value
    } = _ref2;
    return {
      name: text,
      ws: value
    };
  }).filter(v => !!v.ws))('$name @ $ws', async _ref3 => {
    let {
      name,
      ws
    } = _ref3;
    expect(await checker(name, ws)).toBe(true);
  });
}