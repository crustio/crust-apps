// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createRouteBundle } from 'redux-bundler';

import ExplorePage from '../explore/LoadableExplorePage';
import StartExploringPage from '../explore/LoadableStartExploringPage';
import FilesPage from '../files/LoadableFilesPage';
import MarketPage from '../market';
import PeersPage from '../peers/LoadablePeersPage';
import SettingsPage from '../settings/LoadableSettingsPage';
import StatusPage from '../status/LoadableStatusPage';
// import AnalyticsPage from '../settings/AnalyticsPage';
import WelcomePage from '../welcome/LoadableWelcomePage';

export default createRouteBundle({
  '/storage/explore': StartExploringPage,
  '/storage/explore*': ExplorePage,
  '/storage/files': FilesPage,
  '/storage/files*': FilesPage,
  '/storage/ipfs*': FilesPage,
  '/storage/ipns*': FilesPage,
  '/storage/pins*': FilesPage,
  '/storage/peers': PeersPage,
  '/storage/market': MarketPage,
  // '/settings/analytics': AnalyticsPage,
  '/storage/settings*': SettingsPage,
  '/storage/welcome': WelcomePage,
  // '/blank': BlankPage,
  '/storage/status*': StatusPage,
  '/storage_files': MarketPage,
  '/storage_files/status/:cid': MarketPage,
  '/storage': MarketPage,
  '': MarketPage,
  '/': MarketPage
}, { routeInfoSelector: 'selectHash' });
