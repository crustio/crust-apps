// Copyright 2017-2022 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Button, Card, Columar, Input, InputAddress, Tooltip } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { useApi, useCall } from '@polkadot/react-hooks';
import { hexToU8a, isAscii, stringToU8a, u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import AttestDisplay from './Attest';
import ClaimDisplay from './Claim';
import Statement from './Statement';
import { useTranslation } from './translate';
import { getStatement, recoverFromJSON } from './util';
import Warning from './Warning';
// @ts-ignore
import { httpPost } from './http';
import HttpStatus from './HttpStatus';
import { formatBalance } from '@polkadot/util';
import Banner from '@polkadot/app-accounts/Accounts/Banner';
import burnPng from './images/burn_address.png';

export { default as useCounter } from './useCounter';

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

function Claims(): React.ReactElement<Props> {
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

  // This preclaimEthereumAddress holds the result of `api.query.claims.preclaims`:
  // - an `EthereumAddress` when there's a preclaim
  // - null if no preclaim
  // - `PRECLAIMS_LOADING` if we're fetching the results
  const [preclaimEthereumAddress, setPreclaimEthereumAddress] = useState<string | null | undefined | typeof PRECLAIMS_LOADING>(PRECLAIMS_LOADING);
  const isPreclaimed = !!preclaimEthereumAddress && preclaimEthereumAddress !== PRECLAIMS_LOADING;
  const claimLimit = useCall<BalanceOf>(api.query.claims.claimLimit);

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

    api.query.claims
      .claimed<Option<BalanceOf>>(ethereumTxHash?.toString())
      .then(async (claim): Promise<void> => {
        const isClaimed = JSON.parse(JSON.stringify(claim));

        if (isClaimed) {
          setResult('AlreadyClaimed');
          setStatus('error');
          setStatusOpen(true);
        } else {
          const result = await httpPost("https://claim-csm.crust.network/claim/" + ethereumTxHash);
          setIsBusy(false);
          setResult(result.statusText);
          setStatus(result.status);

          if (result.code == 200) {
            setEthereumTxHashValid(true);
            goToStepSign();
          } else {
            api.query.claims
              .claims<Option<BalanceOf>>(ethereumTxHash?.toString())
              .then(async (claim): Promise<void> => {
                const claimOpt = JSON.parse(JSON.stringify(claim));
                if (claimOpt) {
                  setResult('MintClaimSuccess');
                  setStatus('success');
                  setEthereumTxHashValid(true);
                  goToStepSign();
                } else {
                  setResult('MintError, Please try again');
                  setStatus('error');
                }
              })
              .catch((): void => setIsBusy(false));
          }
          setStatusOpen(true);
        }
      })
      .catch((): void => setIsBusy(false))
      .finally(() =>  setIsBusy(false));
  }, [ethereumAddress, goToStepClaim, goToStepSign, isPreclaimed, isOldClaimProcess, ethereumTxHash]);

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

  function convertInput(value: string): [boolean, Uint8Array] {
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

  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}${statementSentence}${ethereumTxHash?.substring(2)}`
    : '';

  return (
    <main>
      {!isOldClaimProcess && <Warning />}
      <h2>
        {t<string>('Claim your {{token}} tokens', {
          replace: {
            token: TokenUnit.abbr
          }
        })}
      </h2>
      <Columar>
        <Columar.Column>
          <Card withBottomMargin>
            <h3>{t<string>('0. Burn your ')}<a href='https://etherscan.io/token/0x2620638eda99f9e7e902ea24a285456ee9438861'>{t('ERC20 CSM')}</a>{t<string>(', transfer to address ')} <a href='https://etherscan.io/address/0x0000000000000000000000000000000000000001' target="_blank">0x0000000000000000000000000000000000000001</a></h3>
            <Banner type='warning'>
              <p>{t<string>('Please make sure you have the authority to make signature with the private key of the wallet account, using an exchange account to sent a transfer (withdrawal) transaction will be invalidated and cause asset loss, you are responsible for the consequences')}</p>
            </Banner>
            <img style={{'marginLeft': 'auto', 'marginRight': 'auto', 'display': 'block', "width": "150px" }} src={burnPng as string} />
          </Card>
          {(<Card withBottomMargin>
            <h3>{t<string>(`1. Select your {{chain}} account and enter`, {
              replace: {
                chain: systemChain
              }
            })} <a href='https://etherscan.io/token/0x2620638eda99f9e7e902ea24a285456ee9438861'>{t('ERC20 CSM')}</a>
             {t<string>(' transfer tx hash')}<span>
               {t<string>(`, If your claim amount is greater than the claim limit `)}
               <span style={{ 'color': '#ff8812', 'textDecoration': 'underline', 'fontStyle': 'italic' }}>({formatBalance(claimLimit, { withUnit: 'CRU' })})</span>
               {t<string>(', please wait for the limit update')}
               </span>
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
                isDisabled={preclaimEthereumAddress === PRECLAIMS_LOADING || ethereumTxHash === null || ethereumTxHash === '' || !isValid}
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
                  help={t<string>('The the Ethereum address you burnt your ERC20 CSM in step 0 (starting by "0x")')}
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
                <div>{t<string>('Copy the following string and sign it with the Ethereum account you burnt your ERC20 CSM in step 0, using the string as the payload, and then paste the transaction signature object below:')}</div>
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
                  placeholder={`{\n  "address": "0x ...",\n  "msg": "0x ...",\n  "sig": "...",\n  "version": "3",\n  "signer": "..."\n}`}
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

export default React.memo(Claims);
