// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { Option } from '../settings/types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location

export function createIpfsGatewayEndpoints (t: TFunction): Option[] {
  return [
    {
      info: 'crust', // 'default' or null
      text: t('Crust Network'),
      value: 'https://crustwebsites.net',
      location: t('Singapore')
    }
  ];
}
