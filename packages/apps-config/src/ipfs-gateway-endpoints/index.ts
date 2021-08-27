// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { AuthIpfsEndpoint } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
export function createAuthIpfsEndpoints (t: TFunction): AuthIpfsEndpoint[] {
  return [
    {
      value: 'https://crustwebsites.net',
      text: t('Crust Network'),
      location: t('Singapore')
    },
    {
      value: 'https://ipfs-auth.decoo.io',
      text: t('Decoo.io'),
      location: t('United States')
    }
  ];
}
