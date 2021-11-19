// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Available, Button, Card, Columar, Input, InputAddress, InputBalance, MarkWarning, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO, formatBalance } from '@polkadot/util';

import logoCrust from '../images/crust.svg';
import ethereumLogo from '../images/Ethereum_logo_2014.svg';
import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { abi } from '../contractAbi';

interface Props {
  className?: string;
  senderId?: string;
}

const contractAddress = "0x32a7C02e79c4ea1008dD6564b35F131428673c41";
const handler = '0x645A36124B537Ea30Cbba25F75599D3F1FE79Ba5'

function EthereumAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, systemChain } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [bridgeFee, setBridgeFee] = useState<BN>(BN_ZERO);
  const isMaxwell = systemChain === 'Crust Maxwell';
  const bridgeTxStatusLink = isMaxwell ? 'https://etherscan.io/address/0x9d332427e6d1b91d9cf8d2fa3b41df2012887aab' : 'https://etherscan.io/address/0x645a36124b537ea30cbba25f75599d3f1fe79ba5';
  const [handlerAsset, setHandlerAsset] = useState<BN | undefined>(BN_ZERO);

  useEffect(() => {
    api.query.bridgeTransfer.bridgeFee(0).then((bridgeFee) => {
      const fee = JSON.parse(JSON.stringify(bridgeFee));

      setBridgeFee(new BN(Number(fee[0]).toString()));
    });
  }, [api]);

  useEffect(() => {
    const provider = ethers.getDefaultProvider();

    const erc20Contract = new ethers.Contract(contractAddress, abi, provider);

    erc20Contract.getBalance(handler).then((res: any) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      setHandlerAsset(new BN((Number(res) / 1000000.0).toString()))
    })
  }, [])

  const onChangeEthereumAddress = useCallback((hex: string) => {
    const isValidEthAddr = hex.startsWith('0x') && ethers.utils.isAddress(hex);

    if (isValidEthAddr) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    setEthereumAddress(hex.trim());
  }, []);

  //   const onChangeEthereumAddress = useCallback((value: string) => {
  //     // FIXME We surely need a better check than just a trim

  //     setEthereumAddress(value.trim());
  //   }, []);

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <Banner type='warning'>
            <p>{t<string>('This function is an internal test stage, the assets will not be lost, but there may be a delay (max to 48 hours) in the arrival of the account.')}</p>
          </Banner>
          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('From Crust')}</span></h3>
          <div style={{ display: 'flex' }}>
            <img src={logoCrust as string}
              style={{ width: '64px', height: '64px', padding: '1px', verticalAlign: 'middle' }} />
            <div style={{ flex: 1, verticalAlign: 'middle' }}>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will sign tx.')}
                isDisabled={!!propSenderId}
                label={t<string>('account')}
                onChange={setSenderId}
                labelExtra={
                  <Available
                    label={t('transferrable')}
                    params={senderId}
                  />
                }
                type='account'
              />
            </div>
          </div>

          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('To Ethereum')}</span></h3>
          <div style={{ display: 'flex', alignItems: 'middle' }}>
            <img src={ethereumLogo as string}
              style={{ width: '64px', height: '64px', padding: '3px', verticalAlign: 'middle' }} />
            <div style={{ flex: 1, verticalAlign: 'middle' }}>
              <Input
                autoFocus
                className='full'
                help={t<string>('The Ethereum address')}
                isError={!isValid}
                label={t<string>('Ethereum address')}
                onChange={onChangeEthereumAddress}
                placeholder={t<string>('0x prefixed hex')}
                value={ethereumAddress || ''}
              />
            </div>
          </div>

          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('Amount')}</span></h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '64px', verticalAlign: 'middle' }}/>
            <div style={{ flex: 1, verticalAlign: 'middle' }}>
              <InputBalance
                autoFocus
                help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                isError={!hasAvailable}
                label={t<string>('amount')}
                onChange={setAmount}
                withMax
              />
              <MarkWarning content={t<string>('The transaction fee is ')}>
                <span style={{'color': '#ff8812', 'textDecoration': 'underline', 'fontStyle': 'italic'}}>{formatBalance(bridgeFee)}</span>&nbsp;<span>{t<string>('(The transaction fee will be dynamically adjusted according to the Gwei of Ethereum)')}</span>
              </MarkWarning>
            </div>
          </div>
          <Button.Group>
            <TxButton
              accountId={senderId}
              icon='paper-plane'
              isDisabled={!isValid || (handlerAsset && amount && handlerAsset.lte(amount)) }
              label={t<string>('Transfer')}
              params={[amount, ethereumAddress, 0]}
              tx={api.tx.bridgeTransfer?.transferNative}
            />
          </Button.Group>
        </Card>
      </Columar.Column>
      <Columar.Column>
        <Card>
          <Banner type="warning">
            <p>{t<string>('Cross-chain transfers are automatically executed by smart contracts. after the execution of the contract is completed, the funds will arrive in the account. Please wait patiently.')}&nbsp;<a target="_blank" href={bridgeTxStatusLink}>{t<string>('You can check the transaction status here...')}</a></p>
          </Banner>
        </Card>
      </Columar.Column>
    </Columar>
  </div>);
}

export default React.memo(styled(EthereumAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
