// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtensionProvider } from '@elrondnetwork/erdjs';

export interface ElrondM {
  isInstalled: boolean,
  isLoad: boolean,
  provider?: ExtensionProvider
}
