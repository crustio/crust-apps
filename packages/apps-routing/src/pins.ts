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
    group: 'pins',
    icon: 'map-pin',
    name: 'pins',
    text: t('Pin', 'Pin', { ns: 'apps-routing' })
  };
}
