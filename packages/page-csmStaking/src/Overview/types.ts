// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
export interface DataProviderState extends ProviderSortRank {
  account: string;
  isFavorite: boolean
}

export type ProviderSortBy = keyof ProviderSortRank;

interface ProviderSortRank {
  csmLimit: number,
  effectiveCSM: number,
  guaranteeFee: number,
  stakedCSM: number,
  storage: number
}

export interface LuckyOrder {
  cid: string;
  size: number;
  topFour: string[];
}

export interface EasterEggsOrder {
  date: number;
  orders: LuckyOrder[];
}
