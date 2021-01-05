// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createRouteBundle } from 'redux-bundler';
import StatusPage from '../status/LoadableStatusPage';
import FilesPage from '../files/LoadableFilesPage';
import StartExploringPage from '../explore/LoadableStartExploringPage';
import ExplorePage from '../explore/LoadableExplorePage';
import PeersPage from '../peers/LoadablePeersPage';
import SettingsPage from '../settings/LoadableSettingsPage';
// import AnalyticsPage from '../settings/AnalyticsPage';
import WelcomePage from '../welcome/LoadableWelcomePage';
import MarketPage from '../market';

export default createRouteBundle({
  '/storage/explore': StartExploringPage,
  '/storage/explore*': ExplorePage,
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
  '/storage': StatusPage
}, { routeInfoSelector: 'selectHash' });
