// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useEffect, useState } from 'react';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { useTranslation } from '@polkadot/apps/translate';
import { Available, Button, Card, Columar, InputAddress, InputBalance, Modal } from '@polkadot/react-components';

import logoCrust from '../images/crust.svg';
import styled from 'styled-components';
import BN from 'bn.js';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
import { getQueryStringArgs } from '@polkadot/apps/Root';
import { BN_ZERO } from '@polkadot/util';
import { useApi } from '@polkadot/react-hooks';
import { ElrondExtensionWallet } from './ElrondExtensionWallet';
import HttpStatus from '@polkadot/app-claims/claims/HttpStatus';

const keyring = new Keyring();

const CRUIdentifier = '4352552d613566346161'
const ElrondExplorerAddress = 'https://explorer.elrond.com/transactions/'

interface Props {
  className?: string;
}

function plusStr (str: string) {
  if (str && str.length > 20) {
    return str.substring(0, 3) + `...` + str.substring(str.length - 4);
  } else {
    return str
  }
}

function ElrondBackAssets ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN>(BN_ZERO);
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [elrondAddress, setElrondAddress] = useState<string | null>();
  const [elrondTxHash, setElrondTxHash] = useState<string | null>();
  const [elrondTxStatus, setElrondStatus] = useState<string | null>();
  const [elrondTxQueryUrl, setElrondTxQueryUrl] = useState<string>(ElrondExplorerAddress);
  const elrondExtensionWallet = new ElrondExtensionWallet();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  // `/#/bridge/elrondToCrust`
  // const callBackUrl = window.location.origin + window.location.pathname + window.location.hash

  const args = getQueryStringArgs();

  useEffect(() => {
    if (args) {
      setElrondAddress(args.elrondAddress)
      setElrondTxHash(plusStr(args.txHash))
      setElrondStatus(args.status)
      setElrondTxQueryUrl(ElrondExplorerAddress+args.txHash)
    }
  }, [args])

  useEffect(() => {
    if (!amount.gt(api.consts.balances.existentialDeposit)) {
      setIsAmountError(true)
    } else {
      setIsAmountError(false)
    }
  }, [api, amount])

  const submit = async () => {
    try {
      const elrondSideAmount = amount.mul(new BN(1_000_000));
      const amountHex = elrondSideAmount.toString(16);
      const payloadAmount = amountHex.length % 2 == 0 ? amountHex : '0' + amountHex
      const dest = u8aToHex(keyring.decodeAddress(receiveId as string)).substring(2);
      const bridgeBackData = `ESDTTransfer@${CRUIdentifier}@${payloadAmount}@${dest}`
      const result = await elrondExtensionWallet.signTransactions(bridgeBackData);
      if (result) {
        setResult('Success');
        setStatus('success');
        setStatusOpen(true);
      } else {
        setResult('Please install Maiar DeFi Wallet extension first');
        setStatus('error');
        setStatusOpen(true);
      }
      
      // window.location.href = `https://wallet.elrond.com/hook/transaction?receiver=${ElrondBridgePoolAddress}&value=0&gasLimit=500000&data=${bridgeBackData}&callbackUrl=${callBackUrl}`
    } catch (error) {
      setResult('Something error');
      setStatus('error');
      setStatusOpen(true);
      console.error(error);
    }
  };

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <HttpStatus
          isStatusOpen={statusOpen}
          message={result}
          setStatusOpen={setStatusOpen}
          status={status}
        />
        <Card withBottomMargin>
          <Modal.Content>
            <Banner type='warning'>
              <p>{t<string>('This function is an internal test stage, the assets will not be lost, but there may be a delay (max to 48 hours) in the arrival of the account.')}</p>
            </Banner>
            {/* <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('From Ethereum')}</span></h3>
            <div style={{display: "flex", alignItems: 'center'}}>
                <img style={{ "width": "64px", height: '64px', padding: '3px', 'verticalAlign': 'middle' }} src={elrond_network as string} />
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                  <Input
                    autoFocus
                    className='full'
                    help={t<string>('The Elrond address')}
                    label={t<string>('Elrond address')}
                    placeholder={t<string>('erd prefixed hex')}
                  />
                </div>
                
            </div> */}
            <Banner type='warning'>
              <p>{t<string>('If you do not have Maiar DeFi Wallet extension installed, please install it first.')}&nbsp;<a
                href='https://getmaiar.com/defi'
                rel='noopener noreferrer'
                target='_blank'
              >{t<string>('Install now...')}</a></p>
            </Banner>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('Receive Account')}</span></h3>
            <div style={{display: "flex"}}>
                <img style={{ "width": "64px", "height": "64px", padding: '1px', 'verticalAlign': 'middle' }} src={logoCrust as string} />
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <InputAddress
                        help={t<string>('The selected account is used to receive tokens')}
                        label={t<string>('account')}
                        onChange={setReceiveId}
                        labelExtra={
                          <Available
                            label={t('transferable')}
                            params={receiveId}
                          />
                        }
                    />
                </div>
            </div>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('Amount')}</span></h3>
            <div style={{display: "flex", alignItems: 'center'}}>
                <div style={{ "width": "64px", 'verticalAlign': 'middle' }}/>
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <InputBalance
                        type={"number"}
                        help={t<string>('Type the amount you want to transfer.')}
                        label={t<string>('amount')}
                        isError={isAmountError}
                        onChange={setAmount}
                        defaultValue={'0'}
                        min={0}
                    >
                    </InputBalance>
                    {
                      (elrondAddress && elrondTxStatus && elrondTxStatus == 'success' && elrondTxHash) && 
                      <Banner type="success">
                        <span style={{ "wordWrap": "break-word", "wordBreak": "break-all", }}>{t<string>(`Your cross-chain asset transaction`)}</span>&nbsp;
                        <a href={elrondTxQueryUrl} target="_blank" style={{'color': '#ff8812', 'fontStyle': 'italic', 'textDecoration': 'underline' }}>{t<string>(`{{ elrondTxHash }}`, {
                          replace: {
                            elrondTxHash
                          }
                        })}</a>&nbsp;
                        <span>{t<string>(`has been successfully sent. Please wait a few minutes to check your assets on Crust Mainnet-side`)}</span>&nbsp;
                      </Banner>
                    }
                    {
                      (elrondAddress && elrondTxStatus && elrondTxStatus == 'cancelled') &&
                      <Banner type='error'>
                        <p>{t<string>('Bridging failed, please try it again.')}</p>
                      </Banner>
                    }
                </div>
            </div>
            <Button.Group>
              <Button
                icon='paper-plane'
                isDisabled={isAmountError}
                label={t<string>('Submit')}
                onClick={submit}
              />
            </Button.Group>
          </Modal.Content>
        </Card>
      </Columar.Column>
    </Columar>
  </div>);
}

export default React.memo(styled(ElrondBackAssets)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
