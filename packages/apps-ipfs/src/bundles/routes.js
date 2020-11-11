// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createRouteBundle } from 'redux-bundler';
import StatusPage from '../status/LoadableStatusPage';
import FilesPage from '../files/LoadableFilesPage';
import StartExploringPage from '../explore/LoadableStartExploringPage';
import ExplorePage from '../explore/LoadableExplorePage';
// import PeersPage from '../peers/LoadablePeersPage'
// import SettingsPage from '../settings/LoadableSettingsPage'
// import AnalyticsPage from '../settings/AnalyticsPage'
import WelcomePage from '../welcome/LoadableWelcomePage';
// import BlankPage from '../blank/BlankPage'

export default createRouteBundle({
  '/storage/explore*': ExplorePage,
  '/storage/files*': FilesPage,
  '/storage/ipfs*': FilesPage,
  '/storage/ipns*': FilesPage,
  '/storage/pins*': FilesPage,
  // '/peers': PeersPage,
  // '/settings/analytics': AnalyticsPage,
  // '/settings*': SettingsPage,
  '/welcome': WelcomePage,
  // '/blank': BlankPage,
  // '/status*': StatusPage,
  '/storage*': StatusPage,
  '/storage': StatusPage
}, { routeInfoSelector: 'selectHash' });
