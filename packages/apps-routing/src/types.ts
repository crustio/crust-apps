// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { AppProps, BareProps } from '@polkadot/react-components/types';

export type RouteGroup =
  'accounts'
  | 'developer'
  | 'applications'
  | 'governance'
  | 'network'
  | 'settings'
  | 'storage'
  | 'csmStaking'
  | 'market';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  Component: React.ComponentType<RouteProps>;
  Modal?: React.ComponentType<any>;
  display: {
    isHidden?: boolean;
    isModal?: boolean;
    needsAccounts?: boolean;
    needsApi?: (string | string[])[];
    needsSudo?: boolean;
  };
  href?: string;
  group: RouteGroup;
  icon?: IconName | 'ipfs';
  logo?: unknown;
  isIgnored?: boolean;
  name: string;
  text: string;
  useCounter?: () => number | string | null;
  beta?: boolean;
}

export type Routes = Route[];
