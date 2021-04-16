// Copyright 2017-2021 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxCallback } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Card, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import {formatBalance} from '@polkadot/util';

import { useTranslation } from '../translate';
import { addrToChecksum } from './util';

interface Props {
  accountId: string;
  className?: string;
  ethereumAddress: EthereumAddress | null;
  ethereumSignature: string | null;
  // Do we sign with `claims.claimAttest` (new) instead of `claims.claim` (old)?
  isOldClaimProcess: boolean;
  onSuccess?: TxCallback;
  statementKind?: StatementKind;
  ethereumTxHash: string;
}

interface ConstructTx {
  params?: any[];
  tx?: (...args: any[]) => SubmittableExtrinsic<'promise'>;
}

// Depending on isOldClaimProcess, construct the correct tx.
// FIXME We actually want to return the constructed extrinsic here (probably in useMemo)
function constructTx (api: ApiPromise, accountId: string, ethereumSignature: string | null, kind: StatementKind | undefined, isOldClaimProcess: boolean, ethereumTxHash: string): ConstructTx {
  if (!ethereumSignature) {
    return {};
  }

  return isOldClaimProcess || !kind
    ? { params: [accountId, ethereumSignature], tx: api.tx.claims.claimCru18 }
    : { params: [accountId, ethereumSignature], tx: api.tx.claims.claimCru18 };
}

function PreClaim ({ accountId, className = '', ethereumAddress, ethereumSignature, ethereumTxHash, isOldClaimProcess, onSuccess, statementKind }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [claimValue, setClaimValue] = useState<BN | null>(null);
  const [isBusy, setIsBusy] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect((): void => {
    if (!ethereumAddress) {
      return;
    }
    api.query.claims
      .cru18PreClaims<Option<BalanceOf>>(ethereumAddress)
      .then((claim): void => {
        const claimOpt = JSON.parse(JSON.stringify(claim));
        if (claimOpt) {
          const claimBalance = new BN(Number(claimOpt)?.toString());
          api.query.claims
          .cru18Claimed<Option<BalanceOf>>(ethereumAddress)
          .then((claimed): void => {
            const claimedOpt = JSON.parse(JSON.stringify(claimed));
            setIsBusy(false)
            if (claimedOpt) {
              setClaimed(true)
            }
            setClaimValue(claimBalance);
          })
          .catch(() => setIsBusy(false));
        } else {
          setClaimValue(new BN(0));
          setIsBusy(false)
        }
      })
      .catch(() => setIsBusy(false));
  }, [api, ethereumSignature, ethereumAddress]);

  // if (!ethereumTxHash || isBusy || !ethereumSignature || !ethereumAddress || !claimedAddress) {
  //   return null;
  // }

  let hasClaim = claimValue && claimValue.gtn(0);

  if (!ethereumAddress || isBusy) {
    return null
  }

  return (
    !claimed ? 
    <Card
      isError={!hasClaim}
      isSuccess={!!hasClaim}
    >
      <div className={className}>
        {t<string>('Your Ethereum account')}
        <h3>{addrToChecksum(ethereumAddress.toString())}</h3>
        {hasClaim
          ? (
            <>
              {t<string>('has a valid claim for')}
              <h2>{formatBalance(new BN(Number(claimValue).toString()), {decimals: 12, withUnit: 'CRU18'})}</h2>
              <Button.Group>
                <TxButton
                  icon='paper-plane'
                  isUnsigned
                  label={t('Claim')}
                  onSuccess={onSuccess}
                  {...constructTx(api, accountId, ethereumSignature, statementKind, isOldClaimProcess, ethereumTxHash)}
                />
              </Button.Group>
            </>
          )
          : (
            <>
              {t<string>('does not appear to have a valid CRU18 claim. Please double check that you have signed the transaction correctly on the correct ETH account.')}
            </>
          )}
      </div>
    </Card> : <Card
      isError={claimed}
    >
      <div className={className}>
        {t<string>('Your Ethereum account')}
        <h3>{addrToChecksum(ethereumAddress.toString())}</h3>
        {t<string>('has already been claimed')}
      </div>
    </Card> 
  );
}

export const ClaimStyles = `
font-size: 1.15rem;
display: flex;
flex-direction: column;
justify-content: center;
min-height: 12rem;
align-items: center;
margin: 0 1rem;

h3 {
  font-family: monospace;
  font-size: 1.5rem;
  max-width: 100%;
  margin: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

h2 {
  margin: 0.5rem 0 2rem;
  font-family: monospace;
  font-size: 2.5rem;
  font-weight: 400;
}
`;

export default React.memo(styled(PreClaim)`${ClaimStyles}`);
