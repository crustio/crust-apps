// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-files/CrustPins';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'applications',
    icon: 'map-pin',
    name: 'pins',
    text: t('Pins', 'Pins', { ns: 'apps-routing' })
  };
}
