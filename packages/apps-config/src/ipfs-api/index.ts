// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { IpfsApiEndpoint } from './types';

export function createIpfsApiEndpoints (t: TFunction): IpfsApiEndpoint[] {
  return [
    {
      baseUrl: 'https://ipfs-gw.crust.network'
    }
  ];
}
