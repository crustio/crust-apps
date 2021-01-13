// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { DeriveStakingOverview } from '@polkadot/api-derive/types';

import { SortedTargets } from '../types';
import CurrentList from './CurrentList';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  next?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
}

function Overview ({ className = '', favorites, hasQueries, isIntentions, next, stakingOverview, targets, toggleFavorite, toggleLedger }: Props): React.ReactElement<Props> {
  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  return (
    <div className={`staking--Overview ${className}`}>
      <CurrentList
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        next={next}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
