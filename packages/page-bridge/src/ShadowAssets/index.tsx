// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Card, Columar, Input, InputAddress, InputCsmBalance, MarkWarning, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO, formatBalance } from '@polkadot/util';
import logoCrust from '../images/crust.svg';
import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { namedLogos } from '@polkadot/apps-config/ui/logos'
import AvailableCsm from '@polkadot/react-components/AvailableCsm';
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

function ShadowAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [bridgeFee, setBridgeFee] = useState<BN>(BN_ZERO);
  const whitePot = 3
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    api.query.bridgeTransfer.bridgeFee(whitePot).then((bridgeFee) => {
      const fee = JSON.parse(JSON.stringify(bridgeFee));
      setBridgeFee(new BN(Number(fee[0]).toString()));
    });
  }, [api]);

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
                  <AvailableCsm
                    label={t('transferrable')}
                    params={senderId}
                  />
                }
                type='account'
              />
            </div>
          </div>

          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('To Shadow')}</span></h3>
          <div style={{ display: 'flex', alignItems: 'middle' }}>
            <img src={namedLogos.shadow as string}
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
              <InputCsmBalance
                autoFocus
                help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                label={t<string>('amount')}
                onChange={setAmount}
                withMax
              />
              <MarkWarning content={t<string>('The transaction fee is ')}>
                <span style={{'color': '#ff8812', 'textDecoration': 'underline', 'fontStyle': 'italic'}}>{formatBalance(bridgeFee)}</span>&nbsp;
              </MarkWarning>
            </div>
          </div>
          <Button.Group>
            <TxButton
              accountId={senderId}
              icon='paper-plane'
              isDisabled={ isAmountError || !isValid }
              label={t<string>('Transfer')}
              params={[amount, receiveId, 3]}
              tx={api.tx.bridgeTransfer?.transferCsmNative}
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

export default React.memo(styled(ShadowAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
