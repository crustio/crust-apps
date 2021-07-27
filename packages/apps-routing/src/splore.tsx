// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import React from 'react';
import { useHistory } from 'react-router-dom';

const Component = () => {
  const history = useHistory();

  history.push('/');

  return <div>Splorer</div>;
};

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.market.addCollateral',
        'tx.market.cutCollateral'
      ]
    },
    group: 'network',
    href: 'https://splorer.crust.network',
    icon: 'boxes',
    name: 'splorer',
    text: t('nav.splorer', 'Splorer', { ns: 'apps-routing' })
  };
}
