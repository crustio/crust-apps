// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Api, { api, DEFAULT_DECIMALS, DEFAULT_SS58 } from './Api';
import ApiContext from './ApiContext';
import { withApi, withCallDiv, withCalls, withMulti, withObservable } from './hoc';
import MainnetApiContext from './MainnetApiContext';

export {
  api,
  Api,
  ApiContext,
  MainnetApiContext,
  DEFAULT_DECIMALS,
  DEFAULT_SS58,
  withApi,
  withCalls,
  withCallDiv,
  withMulti,
  withObservable
};
