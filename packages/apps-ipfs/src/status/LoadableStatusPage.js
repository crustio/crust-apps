// [object Object]
// SPDX-License-Identifier: Apache-2.0
import Loadable from 'react-loadable';

import ComponentLoader from '../loader/ComponentLoader.js';

const LoadableStatusPage = Loadable({
  loader: () => import('./StatusPage'),
  loading: ComponentLoader
});

export default LoadableStatusPage;
