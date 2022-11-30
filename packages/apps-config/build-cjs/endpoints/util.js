"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandEndpoints = expandEndpoints;
exports.getTeleports = getTeleports;
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

let dummyId = 0;
function sortNoop() {
  return 0;
}
function sortLinks(a, b) {
  return !!a.isUnreachable !== !!b.isUnreachable ? a.isUnreachable ? 1 : -1 : 0;
}
function expandLinked(input) {
  const valueRelay = input.map(_ref => {
    let {
      value
    } = _ref;
    return value;
  });
  return input.reduce((result, entry) => {
    result.push(entry);
    return entry.linked ? result.concat(expandLinked(entry.linked).map(child => {
      child.genesisHashRelay = entry.genesisHash;
      child.isChild = true;
      child.textRelay = input.length ? input[0].text : undefined;
      child.valueRelay = valueRelay;
      return child;
    })) : result;
  }, []);
}
function expandEndpoint(t, _ref2, firstOnly, withSort) {
  let {
    dnslink,
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable,
    linked,
    paraId,
    providers,
    teleport,
    text
  } = _ref2;
  const hasProviders = Object.keys(providers).length !== 0;
  const base = {
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable: isUnreachable || !hasProviders,
    paraId,
    teleport,
    text
  };
  const result = Object.entries(hasProviders ? providers : {
    Placeholder: `wss://${++dummyId}`
  }).filter((_, index) => !firstOnly || index === 0).map((_ref3, index) => {
    let [host, value] = _ref3;
    return {
      ...base,
      dnslink: index === 0 ? dnslink : undefined,
      isLightClient: value.startsWith('light://'),
      isRelay: false,
      textBy: value.startsWith('light://') ? t('lightclient.experimental', 'light client (experimental)', {
        ns: 'apps-config'
      }) : t('rpc.hosted.via', 'via {{host}}', {
        ns: 'apps-config',
        replace: {
          host
        }
      }),
      value
    };
  }).sort((a, b) => a.isLightClient ? 1 : b.isLightClient ? -1 : 0);
  if (linked) {
    const last = result[result.length - 1];
    const options = [];
    linked.sort(withSort ? sortLinks : sortNoop).filter(_ref4 => {
      let {
        paraId
      } = _ref4;
      return paraId;
    }).forEach(o => options.push(...expandEndpoint(t, o, firstOnly, withSort)));
    last.isRelay = true;
    last.linked = options;
  }
  return expandLinked(result);
}
function expandEndpoints(t, input, firstOnly, withSort) {
  return input.sort(withSort ? sortLinks : sortNoop).reduce((all, e) => all.concat(expandEndpoint(t, e, firstOnly, withSort)), []);
}
function getTeleports(input) {
  return input.filter(_ref5 => {
    let {
      teleport
    } = _ref5;
    return !!teleport && teleport[0] === -1;
  }).map(_ref6 => {
    let {
      paraId
    } = _ref6;
    return paraId;
  }).filter(id => !!id);
}