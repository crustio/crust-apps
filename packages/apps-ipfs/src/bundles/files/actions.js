/* eslint-disable require-yield */

import CID from 'cids';
import all from 'it-all';
import last from 'it-last';
import map from 'it-map';
import { basename, dirname, join } from 'path';

import countDirs from '../../lib/count-dirs';
import { getDownloadLink, getShareableLink } from '../../lib/files';
import { ACTIONS, IGNORED_FILES } from './consts';
import { addPrefix, Channel, ensureMFS, getRealPath, infoFromPath, perform, send, sortFiles, spawn } from './utils';

/**
 * @typedef {import('ipfs').IPFSService} IPFSService
 * @typedef {import('../../lib/files').FileStream} FileStream
 * @typedef {import('./utils').Info} Info
 * @typedef {import('ipfs').Pin} Pin
 */

/**
 * @typedef {Object} FileStat
 * @property {number} size
 * @property {'directory'|'file'|'unknown'} type
 * @property {CID} cid
 * @property {string} name
 * @property {string} path
 * @property {boolean} pinned
 * @property {boolean|void} isParent
 *
 * @param {Object} stat
 * @param {'dir'|'directory'|'file'|'unknown'} stat.type
 * @param {CID} stat.cid
 * @param {string} stat.path
 * @param {number} [stat.cumulativeSize]
 * @param {number} stat.size
 * @param {string|void} [stat.name]
 * @param {boolean|void} [stat.pinned]
 * @param {boolean|void} [stat.isParent]
 * @param {string} [prefix]
 * @returns {FileStat}
 */
const fileFromStats = ({ cid, contracted, cumulativeSize, isParent, name, path, pinned, size, type }, prefix = '/ipfs') => ({
  size: cumulativeSize || size || 0,
  type: type === 'dir' ? 'directory' : type,
  cid,
  name: name || path.split('/').pop() || cid.toString(),
  path: path || `${prefix}/${cid.toString()}`,
  pinned: Boolean(pinned),
  contracted: Boolean(contracted),
  isParent: isParent
});

/**
 * @param {string} path
 * @returns {string}
 */
// TODO: use sth else
export const realMfsPath = (path) => {
  if (path.startsWith('/files')) {
    return path.substr('/files'.length) || '/';
  }

  return path;
};

/**
 * @typedef {Object} Stat
 * @property {string} path
 * @property {'file'|'directory'|'unknown'} type
 * @property {CID} cid
 * @property {number} size
 *
 * @param {IPFSService} ipfs
 * @param {string|CID} cidOrPath
 * @returns {Promise<Stat>}
 */
const stat = async (ipfs, cidOrPath) => {
  let hashOrPath = cidOrPath.toString();

  hashOrPath = getRealPath(hashOrPath) || '/';
  const path = hashOrPath.startsWith('/')
    ? hashOrPath
    : `/ipfs/${hashOrPath}`;

  try {
    const stats = await ipfs.files.stat(path);

    return { path, ...stats };
  } catch (e) {
    // Discard error and mark DAG as 'unknown' to unblock listing other pins.
    // Clicking on 'unknown' entry will open it in Inspector.
    // No information is lost: if there is an error related
    // to specified hashOrPath user will read it in Inspector.
    const [, , cid] = path.split('/');

    return {
      path: hashOrPath,
      cid: new CID(cid),
      type: 'unknown',
      size: 0
    };
  }
};

/**
 *
 * @param {IPFSService} ipfs
 * @returns {AsyncIterable<Pin>}
 */
const getRawPins = async function * (ipfs) {
  yield * ipfs.pin.ls({ type: 'recursive' });
  yield * ipfs.pin.ls({ type: 'direct' });
};

/**
 * @param {IPFSService} ipfs
 * @returns {AsyncIterable<CID>}
 */
const getPinCIDs = (ipfs) => map(getRawPins(ipfs), (pin) => pin.cid);

/**
 * @param {IPFSService} ipfs
 * @returns {AsyncIterable<FileStat>}
 */
const getPins = async function * (ipfs) {
  for await (const cid of getPinCIDs(ipfs)) {
    const info = await stat(ipfs, cid);

    yield fileFromStats({ ...info, pinned: true }, '/pins');
  }
};
// const getContracts = async function * (){
//     return []
// }

/**
 * @typedef {import('./protocol').Message} Message
 * @typedef {import('./protocol').Model} Model

 * @typedef {import('./selectors').Selectors} Selectors
 * @typedef {import('../ipfs-provider').IPFSProviderStore} IPFSProviderStore
 * @typedef {import('../connected').Selectors} ConnectedSelectors
 *
 * @typedef {Object} ConfigSelectors
 * @property {function():string} selectApiUrl
 * @property {function():string} selectGatewayUrl
 *
 * @typedef {Object} UnkonwActions
 * @property {function(string):Promise<unknown>} doUpdateHash
 * @typedef {Selectors & Actions & IPFSProviderStore & ConnectedSelectors & ConfigSelectors & UnkonwActions} Ext
 * @typedef {import('../ipfs-provider').Extra} Extra
 * @typedef {import('redux-bundler').Store<Model, Message, Ext>} Store
 * @typedef {import('redux-bundler').Context<Model, Message, Ext, Extra>} Context
 * @typedef {import('./protocol').PageContent} PageContent
 *
 * @typedef {import('redux-bundler').Actions<ReturnType<typeof actions>>} Actions
 *
 */

const actions = () => ({
  /**
   * Fetches list of pins and updates `state.pins` on succeful completion.
   * @returns {function(Context):Promise<{pins: CID[]}>}
   */
  doPinsFetch: () => perform(ACTIONS.PIN_LIST, async (ipfs) => {
    const cids = await all(getPinCIDs(ipfs));

    return { pins: cids };
  }),
  doContractsFetch: () => perform(ACTIONS.CONTRACT_LIST, async (ipfs) => {
    // mock get pin filelist
    const cids = await all(getPinCIDs(ipfs));

    return { contracts: cids };
  }),

  /**
   * Syncs currently selected path file list.
   * @returns {function(Context):Promise<void>}
   */
  doFilesFetch: () => async ({ store }) => {
    const isReady = store.selectIpfsReady();
    const isConnected = store.selectIpfsConnected();
    const isFetching = store.selectFilesIsFetching();
    const info = store.selectFilesPathInfo();

    if (isReady && isConnected && !isFetching && info) {
      await store.doFetch(info);
    }
  },

  /**
   * Fetches conten for the currently selected path. And updates
   * `state.pageContent` on succesful completion.
   * @param {Info} info
   * @returns {function(Context): *}
   */
  doFetch: ({ isMfs, isPins, isRoot, path, realPath }) => perform(ACTIONS.FETCH, async (ipfs, { store }) => {
    if (isRoot && !isMfs && !isPins) {
      throw new Error('not supposed to be here');
    }

    if (isRoot && isPins) {
      const pins = await all(getPins(ipfs)); // FIX: pins path

      return {
        path: '/pins',
        fetched: Date.now(),
        type: 'directory',
        content: pins
      };
    }

    const resolvedPath = realPath.startsWith('/ipns')
      ? await last(ipfs.name.resolve(realPath))
      : realPath;

    const stats = await stat(ipfs, resolvedPath);

    const time = Date.now();

    switch (stats.type) {
      case 'unknown': {
        return {
          fetched: time,
          ...stats
        };
      }

      case 'file': {
        return {
          ...fileFromStats({ ...stats, path }),
          fetched: time,
          type: 'file',
          read: () => ipfs.cat(stats.cid),
          name: path.split('/').pop(),
          size: stats.size,
          cid: stats.cid
        };
      }

      case 'directory': {
        return await dirStats(ipfs, stats.cid, {
          path,
          isRoot,
          sorting: store.selectFilesSorting()
        });
      }

      default: {
        throw Error(`Unsupported file type "${stats.type}"`);
      }
    }
  }),

  /**
   * Imports given `source` files to the provided `root` path. On completion
   * (success or fail) will trigger `doFilesFetch` to update the state.
   * @param {FileStream[]} source
   * @param {string} root
   */
  doFilesWrite: (source, root) => spawn(ACTIONS.WRITE, async function * (ipfs, { store }) {
    const files = source
      // Skip ignored files
      .filter(($) => !IGNORED_FILES.includes(basename($.path)))
      // Dropped files come as absolute, those added by the file input come
      // as relative paths, so normalise all to be relative.
      .map(($) => $.path[0] === '/' ? { ...$, path: $.path.slice(1) } : $);

    const uploadSize = files.reduce((prev, { size }) => prev + size, 0);
    // Just estimate download size to be around 10% of upload size.
    const downloadSize = uploadSize * 10 / 100;
    const totalSize = uploadSize + downloadSize;
    let loaded = 0;

    const entries = files.map(({ path, size }) => ({ path, size }));

    yield { entries, progress: 0 };

    const { progress, result } = importFiles(ipfs, files);

    for await (const update of progress) {
      loaded += update.loaded;
      yield { entries, progress: loaded / totalSize * 100 };
    }

    try {
      const added = await result;

      const numberOfFiles = files.length;
      const numberOfDirs = countDirs(files);
      const expectedResponseCount = numberOfFiles + numberOfDirs;

      if (added.length !== expectedResponseCount) {
        // See https://github.com/ipfs/js-ipfs-api/issues/797
        throw Object.assign(new Error('API returned a partial response.'), {
          code: 'ERR_API_RESPONSE'
        });
      }

      for (const { cid, path } of added) {
        // Only go for direct children
        if (path.indexOf('/') === -1 && path !== '') {
          const src = `/ipfs/${cid}`;

          root = getRealPath(root);

          const dst = join(realMfsPath(root || '/files'), path);

          try {
            await ipfs.files.cp(src, dst);
          } catch (err) {
            throw Object.assign(new Error('Folder already exists.'), {
              code: 'ERR_FOLDER_EXISTS'
            });
          }
        }
      }

      yield { entries, progress: 100 };

      return entries;
    } finally {
      await store.doFilesFetch();
    }
  }),

  /**
   * Deletes `files` with provided paths. On completion (success sor fail) will
   * trigger `doFilesFetch` to update the state.
   * @param {string[]} files
   */
  doFilesDelete: (files) => perform(ACTIONS.DELETE, async (ipfs, { store }) => {
    ensureMFS(store);

    if (files.length > 0) {
      const promises = files
        .map((file) => ipfs.files.rm(realMfsPath(getRealPath(file)), {
          recursive: true
        })
        );

      try {
        await Promise.all(promises);

        const src = files[0];
        const path = addPrefix(src.slice(0, src.lastIndexOf('/')));

        await store.doUpdateHash(path);

        return undefined;
      } finally {
        await store.doFilesFetch();
      }
    }

    return undefined;
  }),

  /**
   * Adds file under the `src` path to the given `root` path. On completion will
   * trigger `doFilesFetch` to update the state.
   * @param {string} root
   * @param {string} src
   */
  doFilesAddPath: (root, src) => perform(ACTIONS.ADD_BY_PATH, async (ipfs, { store }) => {
    ensureMFS(store);

    const path = realMfsPath(src);
    /** @type {string} */
    const name = (path.split('/').pop());
    const dst = realMfsPath(join(root, name));
    const srcPath = src.startsWith('/') ? src : `/ipfs/${name}`;

    try {
      return await ipfs.files.cp(srcPath, dst);
    } finally {
      await store.doFilesFetch();
    }
  }),

  /**
   * Creates a download link for the provided files.
   * @param {FileStat[]} files
   */
  doFilesDownloadLink: (files) => perform(ACTIONS.DOWNLOAD_LINK, async (ipfs, { store }) => {
    ensureMFS(store);

    const apiUrl = store.selectApiUrl();
    const gatewayUrl = store.selectGatewayUrl();

    return await getDownloadLink(files, gatewayUrl, apiUrl, ipfs);
  }),

  /**
   * Generates sharable link for the provided files.
   * @param {FileStat[]} files
   */
  doFilesShareLink: (files) => perform(ACTIONS.SHARE_LINK, async (ipfs, { store }) => {
    ensureMFS(store);

    return await getShareableLink(files, ipfs);
  }),

  /**
   * Moves file from `src` MFS path to a `dst` MFS path. On completion (success
   * or fail) triggers `doFilesFetch` to update the state.
   * @param {string} src
   * @param {string} dst
   */
  doFilesMove: (src, dst) => perform(ACTIONS.MOVE, async (ipfs, { store }) => {
    ensureMFS(store);

    try {
      await ipfs.files.mv(realMfsPath(getRealPath(src)), realMfsPath(getRealPath(dst)));

      const page = store.selectFiles();
      const pagePath = page && page.path;

      if (src === pagePath) {
        await store.doUpdateHash(dst);
      }
    } finally {
      await store.doFilesFetch();
    }
  }),

  /**
   * Copies file from `src` MFS path to a `dst` MFS path. On completion (success
   * or fail) triggers `doFilesFetch` to update the state.
   * @param {string} src
   * @param {string} dst
   */
  doFilesCopy: (src, dst) => perform(ACTIONS.COPY, async (ipfs, { store }) => {
    ensureMFS(store);

    try {
      await ipfs.files.cp(realMfsPath(src), realMfsPath(dst));
    } finally {
      await store.doFilesFetch();
    }
  }),

  /**
   * Creates a directory at given MFS `path`. On completion (success or fail)
   * triggers `doFilesFetch` to update the state.
   * @param {string} path
   */
  doFilesMakeDir: (path) => perform(ACTIONS.MAKE_DIR, async (ipfs, { store }) => {
    ensureMFS(store);
    path = getRealPath(path);

    try {
      await ipfs.files.mkdir(realMfsPath(path), {
        parents: true
      });
    } finally {
      await store.doFilesFetch();
    }
  }),

  /**
   * Pins given `cid`. On completion (success or fail) triggers `doPinsFetch` to
   * update the state.
   * @param {CID} cid
   */
  doFilesPin: (cid) => perform(ACTIONS.PIN_ADD, async (ipfs, { store }) => {
    try {
      return await ipfs.pin.add(cid);
    } finally {
      await store.doPinsFetch();
    }
  }),

  /**
   * Unpins given `cid`. On completion (success or fail) triggers `doPinsFetch`
   * to update the state.
   * @param {CID} cid
   */
  doFilesUnpin: (cid) => perform(ACTIONS.PIN_REMOVE, async (ipfs, { store }) => {
    try {
      return await ipfs.pin.rm(cid);
    } finally {
      await store.doPinsFetch();
    }
  }),

  /**
   * Clears all failed tasks.
   */
  doFilesDismissErrors: () => send({ type: ACTIONS.DISMISS_ERRORS }),

  /**
   * @param {string} path
   */
  doFilesNavigateTo: (path) =>
  /**
     * @param {Context} context
     */
    async ({ store }) => {
      if (!path.startsWith('/storage')) {
        path = '/storage' + path;
      }

      const link = path.split('/').map((p) => encodeURIComponent(p)).join('/');
      const files = store.selectFiles();
      const url = store.selectFilesPathInfo();

      if (files && files.path === link && url) {
        await store.doFilesFetch();
      } else {
        await store.doUpdateHash(link);
      }
    },

  /**
   * @param {import('./consts').SORTING} by
   * @param {boolean} asc
   */
  doFilesUpdateSorting: (by, asc) => send({
    type: ACTIONS.UPDATE_SORT,
    payload: { by, asc }
  }),

  /**
   * Clears all the tasks (pending, complete and failed).
   */
  doFilesClear: () => send({ type: ACTIONS.CLEAR_ALL }),

  /**
   * Gets size of the MFS. On succesful completion `state.mfsSize` will get
   * updated.
   */
  doFilesSizeGet: () => perform(ACTIONS.SIZE_GET, async (ipfs) => {
    const stat = await ipfs.files.stat('/');

    return { size: stat.cumulativeSize };
  })
});

export default actions;

/**
 *
 * @param {IPFSService} ipfs
 * @param {FileStream[]} files
 */
const importFiles = (ipfs, files) => {
  /** @type {Channel<{ total:number, loaded: number}>} */
  const channel = new Channel();
  const result = all(ipfs.addAll(files, {
    pin: false,
    wrapWithDirectory: false,
    onUploadProgress: (event) => channel.send(event),
    onDownloadProgress: (event) => channel.send(event)
  }));

  result.then(() => channel.close(), (error) => channel.close(error));

  return { result, progress: channel };
};

/**
 * @param {IPFSService} ipfs
 * @param {CID} cid
 * @param {Object} options
 * @param {string} options.path
 * @param {boolean} [options.isRoot]
 * @param {import('./utils').Sorting} options.sorting
 */
const dirStats = async (ipfs, cid, { isRoot, path, sorting }) => {
  let res = await all(ipfs.ls(cid)) || [];

  res = res.filter((item) => item.name);
  const files = [];
  const showStats = res.length < 100;

  path = getRealPath(path);

  for (const f of res) {
    const absPath = join(path, f.name);
    let file = null;

    if (showStats && (f.type === 'directory' || f.type === 'dir')) {
      file = fileFromStats({ ...await stat(ipfs, f.cid), path: absPath });
    } else {
      file = fileFromStats({ ...await stat(ipfs, f.cid), path: absPath });
    }

    files.push(file);
  }

  let parent = null;

  if (!isRoot) {
    const parentPath = dirname(path);
    const parentInfo = infoFromPath(parentPath, false);

    if (parentInfo && (parentInfo.isMfs || !parentInfo.isRoot)) {
      const realPath = parentInfo.realPath;

      if (realPath && realPath.startsWith('/storage/ipns')) {
        parentInfo.realPath = await last(ipfs.name.resolve(parentInfo.realPath));
      }

      parent = fileFromStats({
        ...await ipfs.files.stat(parentInfo.realPath),
        path: parentInfo.path,
        name: '..',
        isParent: true
      });
    }
  }

  return {
    path: path,
    fetched: Date.now(),
    type: 'directory',
    cid,
    upper: parent,
    content: sortFiles(files, sorting)
  };
};
