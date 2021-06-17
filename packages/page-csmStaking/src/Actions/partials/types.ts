// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

export interface BondInfo {
  bondTx?: SubmittableExtrinsic<'promise'> | null;
  accountId?: string | null;
}

export interface AmountValidateState {
  error: string | null;
  warning: string | null;
}

export interface StakerState {
  accountId: string;
  effectiveCsm: string;
  totalReward: string;
  predictCsm: string
}

export interface SetGuaranteePrefInfo {
  guaranteePrefTx?: SubmittableExtrinsic<'promise'> | null;
}

export interface GuaranteeInfo {
  guaranteeTx?: SubmittableExtrinsic<'promise'> | null;
}