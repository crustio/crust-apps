// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Api, { api, DEFAULT_DECIMALS, DEFAULT_SS58 } from './Api';
import ApiContext from './ApiContext';
import { withApi, withCallDiv, withCalls, withMulti, withObservable } from './hoc';
import EthersProvider from './useEthers';
import Web3Provider from './useWeb3';

export {
  api,
  Api,
  ApiContext,
  DEFAULT_DECIMALS,
  DEFAULT_SS58,
  EthersProvider,
  Web3Provider,
  withApi,
  withCalls,
  withCallDiv,
  withMulti,
  withObservable
};
