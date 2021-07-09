// Copyright 2017-2021 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Button, Card, Columar, Input, InputAddress, Tooltip } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import PreClaimDisplay from './PreClaim';
import Statement from './Statement';
import { useTranslation } from '../translate';
import { getStatement, recoverFromJSON } from './util';
import Warning from './Warning';
// @ts-ignore
import HttpStatus from './HttpStatus';
import type { TFunction } from 'i18next';
import Banner from '@polkadot/app-accounts/Accounts/Banner';

export { default as useCounter } from '../useCounter';

enum Step {
  Account = 0,
  ETHAddress = 1,
  Sign = 2,
  Claim = 3,
}

const PRECLAIMS_LOADING = 'PRECLAIMS_LOADING';

// FIXME no embedded components (hossible to tweak)
const Payload = styled.pre`
  cursor: copy;
  font: var(--font-mono);
  border: 1px dashed #c2c2c2;
  background: #f2f2f2;
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  white-space: normal;
  word-break: break-all;
`;

const Signature = styled.textarea`
  font: var(--font-mono);
  padding: 1rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.25rem;
  margin: 1rem 0;
  resize: none;
  width: 100%;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const transformStatement = {
  transform: (option: Option<StatementKind>) => option.unwrapOr(null)
};

interface TypeOption {
  text: string;
  value: string;
}

export function createTokenTypePrev (t: TFunction): TypeOption[] {
  return [
    { text: t('CRU18'), value: 'CRU18' },
    // { text: t('CRU24'), value: 'CRU24' },
    // { text: t('CRU24D6'), value: 'CRU24D6' }
  ];
}

function ClaimsMainnet (): React.ReactElement<Props> {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [step, setStep] = useState<Step>(Step.Account);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [result] = useState<string>('');
  const [status] = useState<string>('');
  const [ethereumTxHashValid] = useState<boolean>(false);
  const [isBusy] = useState<boolean>(false);
  const [ethereumTxHash, setEthereumTxHash] = useState<string | undefined | null>(null);

  // This preclaimEthereumAddress holds the result of `api.query.claims.preclaims`:
  // - an `EthereumAddress` when there's a preclaim
  // - null if no preclaim
  // - `PRECLAIMS_LOADING` if we're fetching the results
  const [preclaimEthereumAddress, setPreclaimEthereumAddress] = useState<string | null | undefined | typeof PRECLAIMS_LOADING>(PRECLAIMS_LOADING);
  const isPreclaimed = !!preclaimEthereumAddress && preclaimEthereumAddress !== PRECLAIMS_LOADING;

  // Everytime we change account, reset everything, and check if the accountId
  // has a preclaim.
  useEffect(() => {
    if (!accountId) {
      return;
    }

    setStep(Step.Account);
    setEthereumAddress(null);
    setEthereumTxHash(null);
    setPreclaimEthereumAddress(PRECLAIMS_LOADING);

    if (!api.query.claims || !api.query.claims.preclaims) {
      return setPreclaimEthereumAddress(null);
    }

    api.query.claims
      .preclaims<Option<EthereumAddress>>(accountId)
      .then((preclaim): void => {
        const address = preclaim.unwrapOr(null)?.toString();

        setEthereumAddress(address);
        setPreclaimEthereumAddress(address);
      })
      .catch((): void => setPreclaimEthereumAddress(null));
  }, [accountId, api.query.claims, api.query.claims.preclaims]);

  // Old claim process used `api.tx.claims.claim`, and didn't have attest
  const isOldClaimProcess = !api.tx.claims.claimAttest;

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);


  const goToStepSign = useCallback(() => {
    setStep(Step.Sign);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  const handleAccountStep = useCallback(async () => {
    goToStepSign();
  }, [goToStepSign, isPreclaimed, isOldClaimProcess, ethereumTxHash]);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { ethereumAddress, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress?.toString());
    setSignature(signature);
    goToStepSign();
  }, []);

  const onChangeEthereumAddress = useCallback((value: string) => {
    // FIXME We surely need a better check than just a trim

    setEthereumAddress(value.trim());
  }, []);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  // If it's 1/ not preclaimed and 2/ not the old claiming process, fetch the
  // statement kind to sign.
  const statementKind = useCall<StatementKind | null>(!isPreclaimed && !isOldClaimProcess && !!ethereumAddress && api.query.claims.signing, [ethereumAddress], transformStatement);

  const statementSentence = getStatement(systemChain, statementKind)?.sentence || '';

  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}${statementSentence}`
    : '';

  return (
    <main>
      {!isOldClaimProcess && <Warning />}
      
      
      <Columar>
        <Columar.Column>
          <Banner type='error'>
            <p>{t<string>('The claim of CRU18 has ended. For unclaimed accounts, please wait for notification after the mainnet launch')}</p>
          </Banner>
          <Card withBottomMargin>
            {/* <h3>{t<string>(`1. Select your {{chain}} account and enter`, {
                replace: {
                  chain: systemChain
                }
              })} <a href='https://etherscan.io/token/0x32a7C02e79c4ea1008dD6564b35F131428673c41'>{t('ERC20 CRU')}</a> {t<string>('transfer tx hash')} </h3> */}
            <InputAddress
              defaultValue={accountId}
              help={t<string>('The account you want to claim to.')}
              isDisabled={ethereumTxHashValid}
              label={t<string>('claim to account')}
              onChange={setAccountId}
              type='all'
            />
            {/* <Dropdown
              defaultValue={accountId?.toString()}
              help={t<string>('The destination account for any payments as either a nominator or validator')}
              label={t<string>('token types')}
              onChange={setTokenType}
              options={options}
              value={tokenType}
            /> */}
            {(step === Step.Account) && (
              <Button.Group>
                <Button
                  icon='sign-in-alt'
                  isBusy={isBusy}
                  label={preclaimEthereumAddress === PRECLAIMS_LOADING
                    ? t<string>('Loading')
                    : t<string>('Continue')
                  }
                  onClick={handleAccountStep}
                />
              </Button.Group>
            )}
            <HttpStatus
              isStatusOpen={statusOpen}
              message={result}
              setStatusOpen={setStatusOpen}
              status={status}
            />
          </Card>
          {
            // We need to know the ethereuem address only for the new process
            // to be able to know the statement kind so that the users can sign it
            (step >= Step.ETHAddress && !isPreclaimed && !isOldClaimProcess) && (
              <Card withBottomMargin>
                <h3>{t<string>('2. Enter the ETH address from the sale.')}</h3>
                <Input
                  autoFocus
                  className='full'
                  help={t<string>('The the Ethereum address you used during the pre-sale (starting by "0x")')}
                  label={t<string>('Pre-sale ethereum address')}
                  onChange={onChangeEthereumAddress}
                  value={ethereumAddress || ''}
                />
                {(step === Step.ETHAddress) && (
                  <Button.Group>
                    <Button
                      icon='sign-in-alt'
                      isDisabled={!ethereumAddress}
                      label={t<string>('Continue')}
                      onClick={goToStepSign}
                    />
                  </Button.Group>
                )}
              </Card>
            )}
          {(step >= Step.Sign && !isPreclaimed) && (
            <Card>
              <h3>{t<string>('{{step}}. Sign with your ETH address', { replace: { step: isOldClaimProcess ? '2' : '3' } })}</h3>
              {!isOldClaimProcess && (
                <Statement
                  kind={statementKind}
                  systemChain={systemChain}
                />
              )}
              <div>{t<string>('Copy the following string and sign it with the Ethereum account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature object below:')}</div>
              <CopyToClipboard
                onCopy={onCopy}
                text={payload}
              >
                <Payload
                  data-for='tx-payload'
                  data-tip
                >
                  {payload}
                </Payload>
              </CopyToClipboard>
              <Tooltip
                place='right'
                text={didCopy ? t<string>('copied') : t<string>('click to copy')}
                trigger='tx-payload'
              />
              <div>{t<string>('Paste the signed message into the field below. The placeholder text is there as a hint to what the message should look like:')}</div>
              <Signature
                onChange={onChangeSignature}
                placeholder={`{\n  "address": "0x ...",\n  "msg": "${prefix}:...",\n  "sig": "0x ...",\n  "version": "3",\n  "signer": "..."\n}`}
                rows={10}
              />
              {(step === Step.Sign) && (
                <Button.Group>
                  <Button
                    icon='sign-in-alt'
                    isDisabled={!accountId || !signature}
                    label={t<string>('Confirm')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              )}
            </Card>
          )}
        </Columar.Column>
        <Columar.Column>
          {(step >= Step.Claim) && (
            <PreClaimDisplay
              accountId={accountId}
              ethereumAddress={ethereumAddress}
              // tokenType={tokenType}
              ethereumSignature={signature}
              isOldClaimProcess={isOldClaimProcess}
              // onSuccess={goToStepAccount}
              statementKind={statementKind}
              ethereumTxHash={ethereumTxHash}
            />
          )}
        </Columar.Column>
      </Columar>
    </main>
  );
}

export default React.memo(ClaimsMainnet);
