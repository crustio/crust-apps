// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

export interface BondInfo {
  bondTx?: SubmittableExtrinsic<'promise'> | null;
  accountId?: string | null;
}

export interface UnbondInfo {
  unbondTx?: SubmittableExtrinsic<'promise'> | null;
  accountId?: string | null;
}

export interface AmountValidateState {
  error: string | null;
  warning: string | null;
}

export interface GuarantorState {
  account: string;
  frozenBn: number;
  effectiveCsm: number;
  totalRewards: number;
  pendingRewards: number;
  role: string;
  provider: string;
  isProvider: boolean
}

export interface ProviderState {
  account: string;
  storage: number;
  frozenBn: number;
  pendingFiles: number;
  effectiveCsm: number;
  totalRewards: number;
  pendingRewards: number;
  role: string;
  guarantors: string[];
  guaranteeFee: number;
}

export interface SetGuaranteePrefInfo {
  guaranteePrefTx?: SubmittableExtrinsic<'promise'> | null;
}

export interface GuaranteeInfo {
  guaranteeTx?: SubmittableExtrinsic<'promise'> | null;
}
