// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';

import { MainnetApiContext } from '@polkadot/react-api';

import { createNamedHook } from './createNamedHook';

function useMainnetApiImpl (): ApiProps {
  return useContext(MainnetApiContext);
}

export const useMainnetApi = createNamedHook('useMainnetApi', useMainnetApiImpl);
