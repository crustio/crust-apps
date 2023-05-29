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
    value: 'https://gateway.aitimeout.site:18001',
    text: t('hangzhou'),
    location: t('Hangzhou'),
    // crustAddress: cTHrHT5ro6a55cu2FxmmrtJDBy3GMUK86tGC1yfmu4nvqkS63
    // contactInformation: tele: btc eth or email: eoseth59@gmail.com
    status: 'online'
    },
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
    },
    {
      location: t('Shanghai'),
      text: t('️Crato-GW'),
      value: 'https://223.111.148.196',
      crustAddress: cTMYsQAnJy8vg3h8BEXsXj8QtPnXppZR12NcEGsFirj19DxEW,
      status: 'online'
    }
  ];
}
