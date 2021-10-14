// [object Object]
// SPDX-License-Identifier: Apache-2.0
// @ts-ignore
import HttpClient from 'ipfs-http-client';
// @ts-ignore
import { getIpfs, providers } from 'ipfs-provider';
import first from 'it-first';
import last from 'it-last';
import multiaddr from 'multiaddr';

import * as Enum from './enum';
import { perform } from './task';

/**
 * @typedef {import('ipfs').IPFSService} IPFSService
 * @typedef {import('cids')} CID
 * @typedef {import('ipfs').FileStat} FileStat
 * @typedef {'httpClient'|'jsIpfs'|'windowIpfs'|'webExt'} ProviderName
 * @typedef {Object} Model
 * @property {null|string|HTTPClientOptions} apiAddress
 * @property {null|ProviderName} provider
 * @property {boolean} failed
 * @property {boolean} ready
 * @property {boolean} invalidAddress
 * @property {boolean} pendingFirstConnection
 *
 *
 * @typedef {import('./task').Perform<'IPFS_INIT', Error, InitResult, void>} Init
 * @typedef {Object} Stopped
 * @property {'IPFS_STOPPED'} type
 *
 * @typedef {Object} AddressUpdated
 * @property {'IPFS_API_ADDRESS_UPDATED'} type
 * @property {string|HTTPClientOptions} payload
 *
 * @typedef {Object} AddressInvalid
 * @property {'IPFS_API_ADDRESS_INVALID'} type
 *
 * @typedef {Object} Dismiss
 * @property {'IPFS_API_ADDRESS_INVALID_DISMISS'} type
 *
 * @typedef {Object} ConnectSuccess
 * @property {'IPFS_CONNECT_SUCCEED'} type
 *
 * @typedef {Object} ConnectFail
 * @property {'IPFS_CONNECT_FAILED'} type
 *
 * @typedef {Object} DismissError
 * @property {'NOTIFY_DISMISSED'} type
 *
 * @typedef {Object} PendingFirstConnection
 * @property {'IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION'} type
 * @property {boolean} pending
 *
 * @typedef {Object} InitResult
 * @property {ProviderName} provider
 * @property {IPFSService} ipfs
 * @property {string} [apiAddress]
 * @typedef {Init|Stopped|AddressUpdated|AddressInvalid|Dismiss|PendingFirstConnection|ConnectFail|ConnectSuccess|DismissError} Message
 */

export const ACTIONS = Enum.from([
  'IPFS_INIT',
  'IPFS_STOPPED',
  'IPFS_API_ADDRESS_UPDATED',
  'IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION',
  'IPFS_API_ADDRESS_INVALID',
  'IPFS_API_ADDRESS_INVALID_DISMISS',
  // Notifier actions
  'IPFS_CONNECT_FAILED',
  'IPFS_CONNECT_SUCCEED',
  'NOTIFY_DISMISSED'
]);

/**
 * @param {Model} state
 * @param {Message} message
 * @returns {Model}
 */
const update = (state, message) => {
  switch (message.type) {
    case ACTIONS.IPFS_INIT: {
      const { task } = message;
      switch (task.status) {
        case 'Init': {
          return { ...state, ready: false };
        }

        case 'Exit': {
          const { result } = task;

          if (result.ok) {
            const { apiAddress, ipfs: service, provider } = result.value;

            ipfs = service;

            return {
              ...state,
              ready: true,
              failed: false,
              provider,
              apiAddress: apiAddress || state.apiAddress
            };
          } else {
            return {
              ...state,
              ready: false,
              failed: true
            };
          }
        }

        default: {
          return state;
        }
      }
    }

    case ACTIONS.IPFS_STOPPED: {
      return { ...state, ready: false, failed: false };
    }

    case ACTIONS.IPFS_API_ADDRESS_UPDATED: {
      return { ...state, apiAddress: message.payload, invalidAddress: false };
    }

    case ACTIONS.IPFS_API_ADDRESS_INVALID: {
      return { ...state, invalidAddress: true };
    }

    case ACTIONS.IPFS_API_ADDRESS_INVALID_DISMISS: {
      return { ...state, invalidAddress: true };
    }

    case ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION: {
      const { pending } = message;

      return { ...state, pendingFirstConnection: pending };
    }

    case ACTIONS.IPFS_CONNECT_SUCCEED: {
      return { ...state, failed: false };
    }

    case ACTIONS.IPFS_CONNECT_FAILED: {
      return { ...state, failed: true };
    }

    default: {
      return state;
    }
  }
};

/**
 * @returns {Model}
 */
const init = () => {
  return {
    apiAddress: readAPIAddressSetting(),
    provider: null,
    failed: false,
    ready: false,
    invalidAddress: false,
    pendingFirstConnection: false
  };
};

/**
 * @returns {HTTPClientOptions|string|null}
 */
const readAPIAddressSetting = () => {
  const setting = readSetting('ipfsApi');

  return setting == null ? null : asAPIOptions(setting);
};

/**
 * @param {string|object} value
 * @returns {boolean}
 */
export const checkValidAPIAddress = (value) => {
  return asAPIOptions(value) != null;
};

/**
 * @param {string|object} value
 * @returns {HTTPClientOptions|string|null}
 */
const asAPIOptions = (value) => asHttpClientOptions(value) || asMultiaddress(value) || asURL(value);

/**
 * Attempts to turn cast given value into URL.
 * Return either string instance or `null`.
 * @param {any} value
 * @returns {string|null}
 */
const asURL = (value) => {
  try {
    return new URL(value).toString();
  } catch (_) {
    return null;
  }
};

/**
 * Attempts to turn cast given value into Multiaddr.
 * Return either string instance or `null`.
 * @param {any} value
 * @returns {string|null}
 */
const asMultiaddress = (value) => {
  // ignore empty string, as it will produce '/'
  if (value != null && value !== '') {
    try {
      return multiaddr(value).toString();
    } catch (_) {
    }
  }

  return null;
};

/**
 * @typedef {Object} HTTPClientOptions
 * @property {string} [host]
 * @property {string} [port] - (e.g. '443', or '80')
 * @property {string} [protocol] - (e.g 'https', 'http')
 * @property {string} [apiPath] - ('/api/v0' by default)
 * @property {Object<string, string>} [headers]
 */

/**
 * Attempts to turn parse given input as an options object for ipfs-http-client.
 * @param {string|object} value
 * @returns {HTTPClientOptions|null}
 */
const asHttpClientOptions = (value) =>
  typeof value === 'string' ? parseHTTPClientOptions(value) : readHTTPClinetOptions(value);

/**
 *
 * @param {string} input
 */
const parseHTTPClientOptions = (input) => {
  // Try parsing and reading as json
  try {
    return readHTTPClinetOptions(JSON.parse(input));
  } catch (_) {
  }

  // turn URL with inlined basic auth into client options object
  try {
    const uri = new URL(input);
    const { password, username } = uri;

    if (username && password) {
      return {
        host: uri.hostname,
        port: uri.port || (uri.protocol === 'https:' ? '443' : '80'),
        protocol: uri.protocol.slice(0, -1), // trim out ':' at the end
        apiPath: (uri.pathname !== '/' ? uri.pathname : 'api/v0'),
        headers: {
          authorization: `Basic ${btoa(username + ':' + password)}`
        }
      };
    }
  } catch (_) {
  }

  return null;
};

/**
 * @param {Object<string, any>} value
 * @returns {HTTPClientOptions|null}
 */
const readHTTPClinetOptions = (value) => {
  // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#importing-the-module-and-usage
  if (value && (value.host || value.apiPath || value.protocol || value.port || value.headers)) {
    return value;
  } else {
    return null;
  }
};

/**
 * Reads setting from the `localStorage` with a given `id` as JSON. If JSON
 * parse is failed setting is interpreted as a string value.
 * @param {string} id
 * @returns {string|object|null}
 */
const readSetting = (id) => {
  /** @type {string|null} */
  let setting = null;

  if (window.localStorage) {
    try {
      setting = window.localStorage.getItem(id);
    } catch (error) {
      console.error(`Error reading '${id}' value from localStorage`, error);
    }

    try {
      return JSON.parse(setting || '');
    } catch (_) {
      // res was probably a string, so pass it on.
      return setting;
    }
  }

  return setting;
};

/**
 * @param {string} id
 * @param {string|number|boolean|object} value
 */
const writeSetting = (id, value) => {
  try {
    window.localStorage.setItem(id, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing '${id}' value to localStorage`, error);
  }
};

/** @type {IPFSService|null} */
let ipfs = null;

/**
 * @typedef {typeof extra} Extra
 */
const extra = {
  getIpfs () {
    return ipfs;
  }
};

/**
 * @typedef {import('redux-bundler').Selectors<typeof selectors>} Selectors
 */

const selectors = {
  /**
   * @param {State} state
   */
  selectIpfsReady: (state) => state.ipfs.ready,
  /**
   * @param {State} state
   */
  selectIpfsProvider: (state) => state.ipfs.provider,
  /**
   * @param {State} state
   */
  selectIpfsApiAddress: (state) => state.ipfs.apiAddress,
  /**
   * @param {State} state
   */
  selectIpfsInvalidAddress: (state) => state.ipfs.invalidAddress,
  /**
   * @param {State} state
   */
  selectIpfsInitFailed: (state) => state.ipfs.failed,
  /**
   * @param {State} state
   */
  selectIpfsPendingFirstConnection: (state) => state.ipfs.pendingFirstConnection
};

/**
 * @typedef {import('redux-bundler').Actions<typeof actions>} Actions
 * @typedef {Selectors & Actions} Ext
 * @typedef {import('redux-bundler').Context<State, Message, Ext, Extra>} Context
 */

const actions = {
  /**
   * @returns {function(Context):Promise<boolean>}
   */
  doTryInitIpfs: () => async ({ store }) => {
    // There is a code in `bundles/retry-init.js` that reacts to `IPFS_INIT`
    // action and attempts to retry.
    try {
      await store.doInitIpfs();

      return true;
    } catch (_) {
      // Catches connection errors like timeouts
      return false;
    }
  },
  /**
   * @returns {function(Context):Promise<InitResult>}
   */
  doInitIpfs: () => perform('IPFS_INIT',
    /**
     * @param {Context} context
     * @returns {Promise<InitResult>}
     */
    async (context) => {
      const { apiAddress } = context.getState().ipfs;

      const result = await getIpfs({
        // @ts-ignore - TS can't seem to infer connectionTest option
        connectionTest: async (ipfs) => {
          // ipfs connection is working if can we fetch the bw stats.
          // See: https://github.com/ipfs-shipyard/ipfs-webui/issues/835#issuecomment-466966884
          try {
            await last(ipfs.stats.bw({ timeout: 5000 }))
          } catch (err) {
            if (!/bandwidth reporter disabled in config/.test(err)) {
              throw err;
            }
            // return false
          }

          return true;
        },
        loadHttpClientModule: () => HttpClient,
        providers: [
          providers.httpClient({ apiAddress })
        ]
      });
      if (!result) {
        throw Error(`Could not connect to the IPFS API (${apiAddress})`);
      } else {
        return result;
      }
    }),
  /**
   * @returns {function(Context):Promise<void>}
   */
  doStopIpfs: () => async (context) => {
    if (ipfs) {
      await ipfs.stop();
      context.dispatch({ type: 'IPFS_STOPPED' });
    }
  },
  /**
   * @param {string} hash
   * @param {string} peerId
   * @returns {function():Promise<number>}
   */
  // @ts-ignore
  doFindProvs: (hash) => async () => {
    if (ipfs) {
      const find = ipfs.dht.findProvs(hash, { timeout: 30000 });
      let count = 0;

      try {
        // @ts-ignore
        for await (const provider of find) {
          // if (provider.id !== peerId) {
          //
          // }
          count += 1;
        }
      } catch (err) {
        console.error(err);
      }

      return count;
    }
  },
  /**
   * @param {string} address
   * @returns {function(Context):Promise<boolean>}
   */
  doUpdateIpfsApiAddress: (address) => async (context) => {
    const apiAddress = asAPIOptions(address);

    if (apiAddress == null) {
      context.dispatch({ type: ACTIONS.IPFS_API_ADDRESS_INVALID });

      return false;
    } else {
      await writeSetting('ipfsApi', apiAddress);
      context.dispatch({ type: ACTIONS.IPFS_API_ADDRESS_UPDATED, payload: apiAddress });

      // Sends action to indicate we're going to try to update the IPFS API address.
      // There is logic to retry doTryInitIpfs in bundles/retry-init.js, so
      // we're triggering the PENDING_FIRST_CONNECTION action here to avoid blocking
      // the UI while we automatically retry.
      context.dispatch({
        type: ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION,
        pending: true
      });
      context.dispatch({
        type: ACTIONS.IPFS_STOPPED
      });
      context.dispatch({
        type: ACTIONS.NOTIFY_DISMISSED
      });
      const succeeded = await context.store.doTryInitIpfs();

      if (succeeded) {
        context.dispatch({
          type: ACTIONS.IPFS_CONNECT_SUCCEED
        });
      } else {
        context.dispatch({
          type: ACTIONS.IPFS_CONNECT_FAILED
        });
      }

      context.dispatch({
        type: ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION,
        pending: false
      });

      return succeeded;
    }
  },

  /**
   * @returns {function(Context):void}
   */
  doDismissIpfsInvalidAddress: () => (context) => {
    context.dispatch({ type: 'IPFS_API_ADDRESS_INVALID_DISMISS' });
  },

  /**
   * @param {string} path
   * @returns {function(Context):Promise<FileStat>}
   */
  doGetPathInfo: (path) => async () => {
    if (ipfs) {
      return await ipfs.files.stat(path);
    } else {
      throw Error('IPFS is not initialized');
    }
  },

  /**
   * @param {CID} cid
   * @returns {function(Context):Promise<boolean>}
   */
  doCheckIfPinned: (cid) => async () => {
    if (ipfs == null) {
      return false;
    }

    try {
      const value = await first(ipfs.pin.ls({ paths: [cid], type: 'recursive' }));

      return !!value;
    } catch (_) {
      return false;
    }
  }
};

/**
 * @typedef {Actions & Selectors} IPFSProviderStore
 * @typedef {Object} State
 * @property {Model} ipfs
 */

const bundle = {
  name: 'ipfs',
  /**
   * @param {Model|void} state
   * @param {Message} message
   * @returns {Model}
   */
  reducer: (state, message) => update(state == null ? init() : state, message),
  getExtraArgs () {
    return extra;
  },
  ...selectors,
  ...actions
};

export default bundle;
