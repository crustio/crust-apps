// [object Object]
// SPDX-License-Identifier: Apache-2.0
import Loadable from 'react-loadable';

import ComponentLoader from '../loader/ComponentLoader.js';

const LoadableFilesPage = Loadable({
  loader: () => import('./FilesPage'),
  loading: ComponentLoader
});

export default LoadableFilesPage;
