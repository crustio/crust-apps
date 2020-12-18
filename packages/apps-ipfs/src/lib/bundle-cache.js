// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { getConfiguredCache } from 'money-clip';

const bundleCache = getConfiguredCache({
  maxAge: Infinity,
  name: 'bundle-cache',
  version: 1
});

export default bundleCache;
