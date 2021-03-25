// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import Cid from 'cids';
import parseIpldPath from 'ipld-explorer-components/dist/lib/parse-ipld-path'; // Find all the nodes and path boundaries traversed along a given path
import resolveIpldPath from 'ipld-explorer-components/dist/lib/resolve-ipld-path';
import { createAsyncResourceBundle, createSelector } from 'redux-bundler';

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _toArray (arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }

function _unsupportedIterableToArray (o, minLen) {
  if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1);

  if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray (arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; }

  return arr2;
}

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithHoles (arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) {
  try { var info = gen[key](arg); var value = info.value; } catch (error) {
    reject(error);

    return;
  }

  if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); }
}

function _asyncToGenerator (fn) {
  return function () {
    const self = this; const args = arguments;

    return new Promise(function (resolve, reject) {
      const gen = fn.apply(self, args);

      function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value); }

      function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err); }

      _next(undefined);
    });
  };
}

const makeBundle = function makeBundle () {
  // Lazy load ipld because it is a large dependency
  let IpldResolver = null;
  let ipldFormats = null;
  const bundle = createAsyncResourceBundle({
    name: 'explore',
    actionBaseType: 'EXPLORE',
    getPromise: (function () {
      const _getPromise = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee (args) {
        let store, getIpfs, path, pathParts, cidOrFqdn, rest, _yield$getIpld, _ipld, formats, ipld, cid, _yield$resolveIpldPat, targetNode, canonicalPath, localPath, nodes, pathBoundaries;

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                store = args.store, getIpfs = args.getIpfs;
                path = store.selectExplorePathFromHash();

                if (path) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', null);

              case 4:
                pathParts = parseIpldPath(path);

                if (pathParts) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', null);

              case 7:
                cidOrFqdn = pathParts.cidOrFqdn, rest = pathParts.rest;
                _context.prev = 8;

                if (IpldResolver) {
                  _context.next = 17;
                  break;
                }

                _context.next = 12;

                return getIpld();

              case 12:
                _yield$getIpld = _context.sent;
                _ipld = _yield$getIpld.ipld;
                formats = _yield$getIpld.formats;
                IpldResolver = _ipld;
                ipldFormats = formats;

              case 17:
                ipld = makeIpld(IpldResolver, ipldFormats, getIpfs); // TODO: handle ipns, which would give us a fqdn in the cid position.

                cid = new Cid(cidOrFqdn);
                _context.next = 21;

                return resolveIpldPath(ipld, cid, rest);

              case 21:
                _yield$resolveIpldPat = _context.sent;
                targetNode = _yield$resolveIpldPat.targetNode;
                canonicalPath = _yield$resolveIpldPat.canonicalPath;
                localPath = _yield$resolveIpldPat.localPath;
                nodes = _yield$resolveIpldPat.nodes;
                pathBoundaries = _yield$resolveIpldPat.pathBoundaries;

                return _context.abrupt('return', {
                  path: path,
                  targetNode: targetNode,
                  canonicalPath: canonicalPath,
                  localPath: localPath,
                  nodes: nodes,
                  pathBoundaries: pathBoundaries
                });

              case 30:
                _context.prev = 30;
                _context.t0 = _context.catch(8);
                console.warn('Failed to resolve path', path, _context.t0);

                return _context.abrupt('return', {
                  path: path,
                  error: _context.t0.toString()
                });

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, null, [[8, 30]]);
      }));

      function getPromise (_x) {
        return _getPromise.apply(this, arguments);
      }

      return getPromise;
    }()),
    staleAfter: Infinity,
    checkIfOnline: false
  });

  bundle.selectExplorePathFromHash = createSelector('selectRouteInfo', function (routeInfo) {
    if (!routeInfo.url.startsWith('/storage/explore')) return;
    const path = routeInfo.url.slice('/storage/explore'.length);

    return decodeURIComponent(path);
  }); // Fetch the explore data when the address in the url hash changes.

  bundle.reactExploreFetch = createSelector('selectIpfsReady', 'selectExploreIsLoading', 'selectExploreIsWaitingToRetry', 'selectExplorePathFromHash', 'selectExplore', function (ipfsReady, isLoading, isWaitingToRetry, explorePathFromHash, obj) {
    // Wait for ipfs or the pending request to complete
    if (!ipfsReady || isLoading || isWaitingToRetry) return false; // Theres no url path and no data so nothing to do.

    if (!explorePathFromHash && !obj) return false; // We already have the data for the path.

    if (obj && explorePathFromHash === obj.path) return false;

    return {
      actionCreator: 'doFetchExplore'
    };
  }); // Unpack append a dag link target to the current path and update the url hash

  bundle.doExploreLink = function (link) {
    return function (_ref) {
      const store = _ref.store;

      const _store$selectExplore = store.selectExplore();
      const nodes = _store$selectExplore.nodes;
      const pathBoundaries = _store$selectExplore.pathBoundaries;

      const cid = nodes[0].cid;
      const pathParts = pathBoundaries.map(function (p) {
        return p.path;
      }); // add the extra path step from the link to the end

      if (link && link.path) {
        pathParts.push(link.path);
      } // add the root cid to the start

      pathParts.unshift(cid);
      const path = pathParts.join('/');
      const hash = '#/storage/explore/'.concat(path);

      store.doUpdateHash(hash);
    };
  }; // validate user submitted path and put it in url hash fragment

  bundle.doExploreUserProvidedPath = function (path) {
    return function (_ref2) {
      const store = _ref2.store;
      const hash = path ? '#/storage/explore'.concat(ensureLeadingSlash(path)) : '#/storage/explore';

      store.doUpdateHash(hash);
    };
  };

  return bundle;
};

function ensureLeadingSlash (str) {
  if (str.startsWith('/')) return str;

  return '/'.concat(str);
}

function makeIpld (IpldResolver, ipldFormats, getIpfs) {
  return new IpldResolver({
    blockService: getIpfs().block,
    formats: ipldFormats
  });
}

function getIpld () {
  return _getIpld.apply(this, arguments);
}

function _getIpld () {
  _getIpld = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 () {
    let ipldDeps, _ipldDeps$map, _ipldDeps$map2, ipld, formats, ipldEthereum;

    return regeneratorRuntime.wrap(function _callee2$ (_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;

            return Promise.all([import(
            /* webpackChunkName: "ipld" */
              'ipld'), import(
            /* webpackChunkName: "ipld" */
              'ipld-bitcoin'), import(
            /* webpackChunkName: "ipld" */
              'ipld-dag-cbor'), import(
            /* webpackChunkName: "ipld" */
              'ipld-dag-pb'), import(
            /* webpackChunkName: "ipld" */
              'ipld-git'), import(
            /* webpackChunkName: "ipld" */
              'ipld-raw'), import(
            /* webpackChunkName: "ipld" */
              'ipld-zcash'), import(
            /* webpackChunkName: "ipld" */
              'ipld-ethereum')]);

          case 2:
            ipldDeps = _context2.sent;
            // CommonJs exports object is .default when imported ESM style
            _ipldDeps$map = ipldDeps.map(function (mod) {
              return mod.default;
            }), _ipldDeps$map2 = _toArray(_ipldDeps$map), ipld = _ipldDeps$map2[0], formats = _ipldDeps$map2.slice(1); // ipldEthereum is an Object, each key points to a ipld format impl

            ipldEthereum = formats.pop();
            formats.push.apply(formats, _toConsumableArray(Object.values(ipldEthereum)));

            return _context2.abrupt('return', {
              ipld: ipld,
              formats: formats
            });

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return _getIpld.apply(this, arguments);
}

export default makeBundle;
