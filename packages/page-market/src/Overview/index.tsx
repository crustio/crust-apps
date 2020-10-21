// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MerchantSortInfo } from '../types';

import React from 'react';

import CurrentList from './CurrentList';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  toggleFavorite: (address: string) => void;
  merchants: string[];
  merchantSortInfo: MerchantSortInfo[];
}

function Overview ({ className = '', favorites, hasQueries, isIntentions, toggleFavorite, merchants, merchantSortInfo }: Props): React.ReactElement<Props> {
  return (
    <div className={`staking--Overview ${className}`}>
      <CurrentList
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        toggleFavorite={toggleFavorite}
        merchants={merchants}
        merchantSortInfo={merchantSortInfo}
      />
    </div>
  );
}

export default React.memo(Overview);
