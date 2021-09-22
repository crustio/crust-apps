// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { AuthIpfsPinner } from './types';

// Definitions here are with the following values -
//   text: the IPFS pinner name
//   value: the IPFS pinner domain
export function createAuthIpfsPinner (t: TFunction): AuthIpfsPinner[] {
  return [
    // for Beta
    // {
    //   text: t('Beta'),
    //   value: 'https://pinning-service.decoo-cloud.cn'
    // },
    // for prod
    {
      text: t<string>('Crust Pinner'),
      value: 'https://pin.crustcode.com'
    }
  ];
}
