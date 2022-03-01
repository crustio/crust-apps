// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import React, { useEffect, useState } from 'react';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { useTranslation } from '@polkadot/apps/translate';
import { Available, Button, Card, Columar, Dropdown, Input, InputAddress, MarkWarning, Modal } from '@polkadot/react-components';

import logoCrust from '../images/crust.svg';
import styled from 'styled-components';
import BN from 'bn.js';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
import { getQueryStringArgs } from '@polkadot/apps/Root';

const keyring = new Keyring();

const ElrondBridgePoolAddress = 'erd1jjnl4q4s3mqducpsg72edqtu8zyq8jtxvfx2fumpa36hp4rd8q9q9yxpgn';
const CRUIdentifier = '4646462d623032616632'
const ElrondExplorerAddress = 'https://testnet-explorer.elrond.com/transactions/'

interface Props {
  className?: string;
}

function ElrondBackAssets ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('0');
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [elrondAddress, setElrondAddress] = useState<string | null>();
  const [elrondTxHash, setElrondTxHash] = useState<string | null>();
  const [elrondTxStatus, setElrondStatus] = useState<string | null>();
  const [elrondTxQueryUrl, setElrondTxQueryUrl] = useState<string>(ElrondExplorerAddress);

  const args = getQueryStringArgs();

  useEffect(() => {
    if (args) {
      setElrondAddress(args.elrondAddress)
      setElrondTxHash(args.txHash)
      setElrondStatus(args.status)
      setElrondTxQueryUrl(ElrondExplorerAddress+args.txHash)
    }
  }, [args])

  useEffect(() => {
    if (Number(amount) <= 0) {
      setIsAmountError(true)
    } else {
      setIsAmountError(false)
    }
  }, [amount])

  const submit = async () => {
    try {
      const elrondSideAmount = Number(amount).toString() + `000000000000000000`;
      const amountHex = new BN(elrondSideAmount).toString(16);
      const payloadAmount = amountHex.length % 2 == 0 ? amountHex : '0' + amountHex
      const dest = u8aToHex(keyring.decodeAddress(receiveId as string)).substring(2);
      const bridgeBackData = `ESDTTransfer@${CRUIdentifier}@${payloadAmount}@${dest}`
      window.location.href = `https://testnet-wallet.elrond.com/hook/transaction?receiver=${ElrondBridgePoolAddress}&value=0&gasLimit=500000&data=${bridgeBackData}&callbackUrl=${window.location.origin}${window.location.pathname}${window.location.hash}`
    } catch (error) {
      console.error(error);
    }
  };

  const unitOption = [{ text: "CRU", value: "CRU" }]

  return (<div className={className}>
    <Columar>
      <Columar.Column>
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
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('Destination address')}</span></h3>
            <div style={{display: "flex"}}>
                <img style={{ "width": "64px", "height": "64px", padding: '1px', 'verticalAlign': 'middle' }} src={logoCrust as string} />
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <InputAddress
                        help={t<string>('The selected account is used to receive tokens')}
                        label={t<string>('account')}
                        onChange={setReceiveId}
                        labelExtra={
                          <Available
                            label={t('transferrable')}
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
                    <Input
                        type={"number"}
                        help={t<string>('Type the amount you want to transfer.')}
                        label={t<string>('amount')}
                        isError={isAmountError}
                        onChange={setAmount}
                        defaultValue={'0'}
                        min={0}
                    >
                        <Dropdown
                            defaultValue={unitOption[0].value}
                            dropdownClassName='ui--SiDropdown'
                            isButton
                            options={unitOption}
                        />
                    </Input>
                    {
                      (elrondAddress && elrondTxStatus && elrondTxStatus == 'success' && elrondTxHash) && <MarkWarning content={t<string>(`Your elrond bridge transfer succed.`)}>&nbsp;
                      <span>{t<string>(`you can check you elrond transaction with elrond txHash`)}</span>&nbsp;
                      <a href={elrondTxQueryUrl} target="_blank" style={{'color': '#ff8812', 'fontStyle': 'italic', 'textDecoration': 'underline' }}>{t<string>(`{{ elrondTxHash }}`, {
                        replace: {
                          elrondTxHash
                        }
                      })}</a>&nbsp;
                      </MarkWarning>
                    }
                    {
                      (elrondAddress && elrondTxStatus && elrondTxStatus == 'cancelled') && <MarkWarning content={t<string>(`Your elrond bridge transfer has been cancelled.`)}>&nbsp;
                      {/* <span style={{'color': '#ff8812', 'fontStyle': 'italic'}}>{t<string>(``)}</span>&nbsp; */}
                      </MarkWarning>
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
