// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { composeBundles, createCacheBundle } from 'redux-bundler';
import connectedBundle from './connected';
export default composeBundles(connectedBundle);
