// Copyright 2017-2021 @polkadot/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Option } from '../settings/types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual gateway value

export function createIpfsGatewayEndpoints (t: TFunction): Option[] {
  return [
    {
      info: 'crust', // 'default' or null
      text: t('Gateway by Crust Network'),
      value: 'https://xxx.crust.network',
      location: t('some where')
    }
  ];
}
