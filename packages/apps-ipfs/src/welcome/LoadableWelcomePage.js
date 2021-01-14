// [object Object]
// SPDX-License-Identifier: Apache-2.0
import Loadable from 'react-loadable';

import ComponentLoader from '../loader/ComponentLoader.js';

const LoadableWelcomePage = Loadable({
  loader: () => import('./WelcomePage'),
  loading: ComponentLoader
});

export default LoadableWelcomePage;
