// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Card, Columar, Input, InputAddress, InputBalance, MarkWarning, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import logoCrust from '../images/crust.svg';
import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { Keyring } from '@polkadot/api';

interface Props {
  className?: string;
  senderId?: string;
}

const keyring = new Keyring();

const getMainnetAddr = (addr: string) => {
    try {
        return keyring.encodeAddress(keyring.decodeAddress(addr), 66)
    } catch (error) {
        return null;
    }
}

function ParachainAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (Number(amount) <= 0) {
      setIsAmountError(true)
    } else {
      setIsAmountError(false)
    }
  }, [amount])

  const onChangeShadowAddress = useCallback((address: string) => {
    const isValidShadowAddr = getMainnetAddr(address);
    if (isValidShadowAddr !== null) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    setReceiveId(address.trim());
  }, []);

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <Banner type='warning'>
            <p>{t<string>('This function is an internal test stage, the assets will not be lost, but there may be a delay (max to 48 hours) in the arrival of the account.')}&nbsp;<a target="_blank" href={'https://shadow-apps.crust.network/?rpc=wss%3A%2F%2Frpc-shadow.crust.network#/accounts'}>{t<string>('You can check the CSM assets here...')}</a></p>
          </Banner>
          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('From Parachain')}</span></h3>
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
                type='account'
              />
            </div>
          </div>

          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('To Crust')}</span></h3>
          <div style={{ display: 'flex', alignItems: 'middle' }}>
            <img src={logoCrust as string}
              style={{ width: '64px', height: '64px', padding: '3px', verticalAlign: 'middle' }} />
            <div style={{ flex: 1, verticalAlign: 'middle' }}>
                <Input
                    autoFocus
                    className='full'
                    help={t<string>('The Shadow address')}
                    isError={!isValid}
                    label={t<string>('Shadow address')}
                    onChange={onChangeShadowAddress}
                    placeholder={t<string>('cT prefixed address')}
                    value={receiveId || ''}
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
                label={t<string>('amount')}
                onChange={setAmount}
                withMax
              />
              <MarkWarning content={t<string>('Please reserve a small amount of CRU as transaction fee')}>
              </MarkWarning>
            </div>
          </div>
          <Button.Group>
            <TxButton
              accountId={senderId}
              icon='paper-plane'
              isDisabled={ isAmountError || !isValid }
              label={t<string>('Transfer')}
              params={[amount, receiveId, 0]}
              tx={api.tx.bridgeTransfer?.transferNative}
            />
          </Button.Group>
        </Card>
      </Columar.Column>
      {/* <Columar.Column>
        <Card>
          <Banner type="warning">
            <p>{t<string>('Cross-chain transfers are automatically executed by smart contracts. after the execution of the contract is completed, the funds will arrive in the account. Please wait patiently.')}&nbsp;<a target="_blank" href={bridgeTxStatusLink}>{t<string>('You can check the transaction status here...')}</a></p>
          </Banner>
        </Card>
      </Columar.Column> */}
    </Columar>
  </div>);
}

export default React.memo(styled(ParachainAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;
      label {
        left: 1.55rem;
      }
    }
  }
`);