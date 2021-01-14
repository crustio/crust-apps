// [object Object]
// SPDX-License-Identifier: Apache-2.0
import Loadable from 'react-loadable';

import ComponentLoader from '../loader/ComponentLoader.js';

const LoadableStartExploringPage = Loadable({
  loader: () => import('./StartExploringContainer'),
  loading: ComponentLoader
});

export default LoadableStartExploringPage;
