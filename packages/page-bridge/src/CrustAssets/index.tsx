// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Card, Columar, InputAddress, InputBalance, MarkWarning, TxButton } from '@polkadot/react-components';
import { BN_ZERO, formatBalance } from '@polkadot/util';
import logoCrust from '../images/crust.svg';
import { useMainnetApi } from '@polkadot/react-hooks/useMainnetApi';
import { useApi, useCall } from '@polkadot/react-hooks';
import type { Balance } from '@polkadot/types/interfaces';
import AvailableMainnetCru from '@polkadot/react-components/AvailableMainnetCru';

interface Props {
  className?: string;
  senderId?: string;
}

function CrustAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api: mainnetApi } = useMainnetApi();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  // const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  // const [isValid, setIsValid] = useState(false);
  const bridgeLimit = useCall<Balance>(api.query.bridgeTransfer?.bridgeLimit);

  useEffect(() => {
    if (bridgeLimit) {
      if (amount && Number(amount) <= 0 && bridgeLimit.gt(amount)) {
        setIsAmountError(true)
      } else {
        setIsAmountError(false)
      }
    }

  }, [amount, bridgeLimit])

  // const onChangeShadowAddress = useCallback((address: string) => {
  //   const isValidShadowAddr = getMainnetAddr(address);
  //   if (isValidShadowAddr !== null) {
  //     setIsValid(true);
  //   } else {
  //     setIsValid(false);
  //   }

  //   setReceiveId(address.trim());
  // }, []);

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <h3><span style={{ fontWeight: 'bold' }}>{t<string>('From Crust to Parachain')}</span></h3>
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
                labelExtra={
                  <AvailableMainnetCru
                    label={t('mainnet transferable')}
                    params={senderId}
                  />
                }
              />
            </div>
          </div>

          {/* <h3><span style={{ fontWeight: 'bold' }}>{t<string>('To Parachain')}</span></h3>
          <div style={{ display: 'flex', alignItems: 'middle' }}>
            <img src={logoCrust as string}
              style={{ width: '64px', height: '64px', padding: '3px', verticalAlign: 'middle' }} />
            <div style={{ flex: 1, verticalAlign: 'middle' }}>
                <Input
                    autoFocus
                    className='full'
                    help={t<string>('The Crust parachain address')}
                    isError={!isValid}
                    label={t<string>('Crust parachain address')}
                    onChange={onChangeShadowAddress}
                    placeholder={t<string>('es prefixed address')}
                    value={receiveId || ''}
                />
            </div>
          </div> */}

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
              {bridgeLimit &&<MarkWarning content={t<string>(`Please make sure that the amount you want to transfer is less than the the transfer bridge limit ({{limit}}).`, {
                replace: {
                  limit: formatBalance(bridgeLimit, { decimals: 12, forceUnit: '-', withUnit: true })
                }
              })}>
              </MarkWarning>}
            </div>
          </div>
          <Button.Group>
            <TxButton
              accountId={senderId}
              icon='paper-plane'
              isDisabled={ isAmountError }
              label={t<string>('Transfer')}
              params={[amount, senderId]}
              tx={mainnetApi.tx.bridgeTransfer.transferToPolkadotParachain}
            />
          </Button.Group>
        </Card>
      </Columar.Column>
    </Columar>
  </div>);
}

export default React.memo(styled(CrustAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;
      label {
        left: 1.55rem;
      }
    }
  }
`);