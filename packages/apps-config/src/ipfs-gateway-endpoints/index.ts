// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

import type { TFunction } from 'i18next';
import type { AuthIpfsEndpoint } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
//   status: IPFS gateway status: online, error, inactivated(incluede null and all other strings)
export function createAuthIpfsEndpoints (t: TFunction): AuthIpfsEndpoint[] {
  return [
    // for prod
    {
      location: t('Singapore'),
      text: t('DCF'),
      value: 'https://crustipfs.xyz',
      status: 'online'
    },
    {
      location: t('Seattle'),
      text: t('⚡ Thunder'),
      value: 'Private use, please contact hi@crust.network to get more details',
      status: 'inactivated'
    },
    {
      location: t('Berlin'),
      text: t('Crust Network'),
      value: 'https://ipfs-gw.decloud.foundation',
      status: 'online'
    },
    {
      location: t('Shanghai'),
      text: t('️⚡ Thunder'),
      value: 'https://gw.crustfiles.net',
      status: 'online'
    }
    {
    value: 'http://223.111.148.195',
    text: t('Area51-GW'),
    location: t('Shanghai'),
    // crustAddress: cTHa2wtCS1LouRceECULTYCvdoi9HSMr638Uzx8zWsVP9mVDi
    // contactInformation: jingmu.lemon@gmail.com
}
  ];
}
