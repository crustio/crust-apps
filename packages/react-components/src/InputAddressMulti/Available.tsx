// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { SortedTargets } from '@polkadot/app-staking/types';

import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  filter: string;
  isHidden?: boolean;
  onSelect: (address: string) => void;
  targets?: SortedTargets;
}

function Available ({ address, filter, isHidden, onSelect, targets }: Props): React.ReactElement<Props> | null {
  const _onSelect = useCallback(
    () => onSelect(address),
    [address, onSelect]
  );

  if (isHidden) {
    return null;
  }

  return (
    <AddressToggle
      address={address}
      filter={filter}
      noToggle
      onChange={_onSelect}
      targets={targets}
    />
  );
}

export default React.memo(Available);
