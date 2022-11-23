// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from './types';

import React from 'react';

const MainnetApiContext: React.Context<ApiProps> = React.createContext({} as unknown as ApiProps);
const MainnetApiConsumer: React.Consumer<ApiProps> = MainnetApiContext.Consumer;
const MainnetApiProvider: React.Provider<ApiProps> = MainnetApiContext.Provider;

export default MainnetApiContext;

export {
  MainnetApiConsumer,
  MainnetApiProvider
};
