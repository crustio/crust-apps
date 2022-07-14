// Copyright 2017-2021 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

import { Button, Card, Columar, Input, InputAddress, Tooltip } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { hexToU8a, isAscii, stringToU8a, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import AttestDisplay from './Attest';
import ClaimDisplay from './Claim';
import Statement from './Statement';
import { useTranslation } from '../translate';
import { getStatement, recoverFromJSON } from './util';
import Warning from './Warning';
// @ts-ignore
import { httpPost } from './http';
import HttpStatus from './HttpStatus';
import claimPng from '../images/claim-addr.png';
import { formatBalance } from '@polkadot/util';
import Banner from '@polkadot/app-accounts/Accounts/Banner';

export { default as useCounter } from '../useCounter';

enum Step {
  Transfer = -1,
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

function CSMClaims (): React.ReactElement<Props> {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [step, setStep] = useState<Step>(Step.Account);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ethereumTxHashValid, setEthereumTxHashValid] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [ethereumTxHash, setEthereumTxHash] = useState<string | undefined | null>(null);
  const csmClaimLimit = useCall<BalanceOf>(api.query.claims.csmClaimLimit);

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

  const goToStepAccount = useCallback(() => {
    setStep(Step.Account);
    setEthereumTxHash("");
    setEthereumTxHashValid(false);
  }, []);

  const goToStepSign = useCallback(() => {
    setStep(Step.Sign);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  const handleAccountStep = useCallback(async () => {
    setIsBusy(true);
    const result = await httpPost("https://csm-bridge-api.crust.network/csmClaim/" + ethereumTxHash);

    setIsBusy(false);
    setResult(result.statusText);
    setStatus(result.status);

    if (result.code == 200) {
      setStatusOpen(true);
      setEthereumTxHashValid(true);
      goToStepSign();
    } else {
      api.query.claims
        .csmClaims<Option<BalanceOf>>(ethereumTxHash?.toString())
        .then((claim): void => {
          const claimOpt = JSON.parse(JSON.stringify(claim));

          if (claimOpt) {
            api.query.claims
              .csmClaimed<Option<BalanceOf>>(ethereumTxHash?.toString())
              .then((claimed): void => {
                const isClaimed = JSON.parse(JSON.stringify(claimed));

                if (isClaimed) {
                  setStatusOpen(true);
                } else {
                  setStatusOpen(true);
                  setResult('MintClaimSuccess');
                  setStatus('success');
                  setEthereumTxHashValid(true);
                  goToStepSign();
                }
              });
          } else {
            setStatusOpen(true);
          }
        })
        .catch((): void => setIsBusy(false));
    }
  }, [ethereumAddress, goToStepAccount, goToStepClaim, goToStepSign, isPreclaimed, isOldClaimProcess, ethereumTxHash]);

  const onChangeEthereumTxHash = useCallback((hex: string) => {
    let [isValid, value] = convertInput(hex);

    isValid = isValid && (
      length !== -1
        ? value.length === 32
        : value.length !== 0
    );
    setIsValid(isValid);
    setEthereumTxHash(hex.trim());
  }, [ethereumTxHash]);

  function convertInput (value: string): [boolean, Uint8Array] {
    if (value === '0x') {
      return [true, new Uint8Array([])];
    } else if (value.startsWith('0x')) {
      try {
        return [true, hexToU8a(value)];
      } catch (error) {
        return [false, new Uint8Array([])];
      }
    }

    // maybe it is an ss58?
    try {
      return [true, decodeAddress(value)];
    } catch (error) {
      // we continue
    }

    return isAscii(value)
      ? [true, stringToU8a(value)]
      : [value === '0x', new Uint8Array([])];
  }

  // Depending on the account, decide which step to show.
  // const handleAccountStep = useCallback(() => {
  //   if (isPreclaimed) {
  //     goToStepClaim();
  //   } else if (ethereumAddress || isOldClaimProcess) {
  //     goToStepSign();
  //   } else {
  //     setStep(Step.ETHAddress);
  //   }
  // }, [ethereumAddress, goToStepClaim, goToStepSign, isPreclaimed, isOldClaimProcess]);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { ethereumAddress, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress?.toString());
    setSignature(signature);
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

  // const prefix = u8aToString(api.consts.claims.CsmPrefix.toU8a(true));
  const prefix = 'Pay CSMs to the Crust account:'
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}${statementSentence}${ethereumTxHash?.substring(2)}`
    : '';
  
  return (
    <main>
      {!isOldClaimProcess && <Warning />}
      <Columar>
        <Columar.Column>
          <Banner type='warning'>
            <p>
              <span style={{ "wordWrap": "break-word", "wordBreak": "break-all"  }}>
                <span>{t<string>('According to the original plan, Maxwell network is about to enter the end of its life and will close the claim function. Please go to the ')}
                <span><a href='https://apps.crust.network/?rpc=wss%3A%2F%2Fcrust.api.onfinality.io%2Fpublic-ws#/explorer'>{t<string>('main network ')}</a></span><span>{t<string>('or')}</span>
                <span><a href='https://shadow-apps.crust.network/?rpc=wss%3A%2F%2Frpc2-shadow.crust.network#/explorer'>{t<string>('shadow network ')}</a></span>
                <span>{t<string>('to claim CRU or CSM')}</span>
                </span>
              </span>
            </p>
          </Banner>
        </Columar.Column>
      </Columar>
      <h1>
        <Trans>Claim your <em>CSM</em> tokens</Trans>
      </h1>
      <Columar>
        <Columar.Column>
          <Card withBottomMargin>
            <h3><span style={{"wordWrap": "break-word", "wordBreak": "break-all"}}>{t<string>(`0. Please make sure you have the authority to make signature with the private key of the wallet account `)}<span style={{ 'fontWeight': 'bold' }}>({t<string>('address: ')}<a href='https://etherscan.io/address/0x17a9037cdfb24ffcc13697d03c3bcd4dff34732b' target="_blank">0x17A9037cdFB24FfcC13697d03C3bcd4DFF34732b</a>)</span><span>{t<string>(', using an exchange account to sent a transfer (withdrawal) transaction will be invalidated and cause asset loss.')}</span> <span style={{ 'fontWeight': 'bold', 'color': 'red' }}>{t<string>(` You are responsible for the consequences!`)}</span></span></h3>
            <img style={{'marginLeft': 'auto', 'marginRight': 'auto', 'display': 'block', "width": "150px" }} src={claimPng as string} />
          </Card>
          {(<Card withBottomMargin>
            <h3>{t<string>(`1. Select your {{chain}} account and enter`, {
                replace: {
                  chain: systemChain
                }
              })} <a href='https://rinkeby.etherscan.io/token/0x7a1c61c526dae21c23b50a490c18d04f8077608f'>{t('ERC20 CSM')}</a> {t<string>('transfer tx hash')}, <span>{t<string>(`The remaining claim limit is `)}<span style={{'color': '#ff8812', 'textDecoration': 'underline', 'fontStyle': 'italic'}}>{formatBalance(csmClaimLimit, {  decimals: 12, withUnit: 'CSM' })}</span><span>{t<string>(`, If your claim amount is greater than the claim limit, please wait for the limit update`)}</span></span>
            </h3>

           <InputAddress
              defaultValue={accountId}
              help={t<string>('The account you want to claim to.')}
              isDisabled={ethereumTxHashValid}
              label={t<string>('claim to account')}
              onChange={setAccountId}
              type='account'
            />
            <Input
              autoFocus
              className='full'
              help={t<string>('The Ethereum CSM transfer tx hash (starting by "0x")')}
              isDisabled={ethereumTxHashValid}
              isError={!isValid}
              label={t<string>('Ethereum tx hash')}
              onChange={onChangeEthereumTxHash}
              placeholder={t<string>('0x prefixed hex, e.g. 0x1234 or ascii data')}
              value={ethereumTxHash || ''}
            />
            {(step === Step.Account) && (<Button.Group>
              <Button
                icon='sign-in-alt'
                isBusy={isBusy}
                isDisabled={true || preclaimEthereumAddress === PRECLAIMS_LOADING || ethereumTxHash === null || ethereumTxHash === '' || !isValid}
                label={preclaimEthereumAddress === PRECLAIMS_LOADING
                  ? t<string>('Loading')
                  : t<string>('Continue')
                }
                onClick={handleAccountStep}
              />
            </Button.Group>)}
            
            <HttpStatus
              isStatusOpen={statusOpen}
              message={result}
              setStatusOpen={setStatusOpen}
              status={status}
            />
          </Card>)}
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
                placeholder={`{\n  "address": "0x ...",\n  "msg": "${prefix}...",\n  "sig": "0x ...",\n  "version": "3",\n  "signer": "..."\n}`}
                rows={10}
              />
              {(step === Step.Sign) && (
                <Button.Group>
                  <Button
                    icon='sign-in-alt'
                    isDisabled={!accountId || !signature}
                    label={t<string>('Confirm claim')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              )}
            </Card>
          )}
        </Columar.Column>
        <Columar.Column>
          {(step >= Step.Claim) && (
            isPreclaimed
              ? <AttestDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                onSuccess={goToStepAccount}
                statementKind={statementKind}
                systemChain={systemChain}
              />
              : <ClaimDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                ethereumSignature={signature}
                isOldClaimProcess={isOldClaimProcess}
                onSuccess={goToStepAccount}
                statementKind={statementKind}
                ethereumTxHash={ethereumTxHash}
              />
          )}
        </Columar.Column>
      </Columar>
    </main>
  );
}

export default React.memo(CSMClaims);
