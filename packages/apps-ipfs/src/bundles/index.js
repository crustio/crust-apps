// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { exploreBundle } from 'ipld-explorer-components';
import { composeBundles, createCacheBundle } from 'redux-bundler';

import bundleCache from '../lib/bundle-cache';
import createAnalyticsBundle from './analytics';
import appIdle from './app-idle';
import cliTutorModeBundle from './cli-tutor-mode';
import configBundle from './config';
import configSaveBundle from './config-save';
import connectedBundle from './connected';
import experimentsBundle from './experiments';
import filesBundle from './files';
import gatewayBundle from './gateway';
import identityBundle from './identity';
import ipfsDesktop from './ipfs-desktop';
import ipfsProvider from './ipfs-provider';
import nodeBandwidthBundle from './node-bandwidth';
import nodeBandwidthChartBundle from './node-bandwidth-chart';
import notifyBundle from './notify';
import orderBundle from './orders';
import peerLocationsBundle from './peer-locations';
import peersBundle from './peers';
import redirectsBundle from './redirects';
import repoStats from './repo-stats';
import retryInitBundle from './retry-init';
import routesBundle from './routes';
import toursBundle from './tours';

export default composeBundles(
  createCacheBundle({
    cacheFn: bundleCache.set
  }),
  appIdle({ idleTimeout: 5000 }),
  ipfsProvider,
  identityBundle,
  routesBundle,
  redirectsBundle,
  toursBundle,
  orderBundle,
  filesBundle(),
  exploreBundle(),
  configBundle,
  configSaveBundle,
  gatewayBundle,
  nodeBandwidthBundle,
  nodeBandwidthChartBundle(),
  peersBundle,
  peerLocationsBundle(),
  notifyBundle,
  connectedBundle,
  retryInitBundle,
  experimentsBundle,
  ipfsDesktop,
  repoStats,
  cliTutorModeBundle,
  createAnalyticsBundle({})
);
