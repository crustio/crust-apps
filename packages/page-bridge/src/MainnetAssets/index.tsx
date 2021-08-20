// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Card, Columar, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  className?: string;
  senderId?: string;
}

function EthereumAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const onChangeEthereumAddress = useCallback((value: string) => {
    // FIXME We surely need a better check than just a trim

    setEthereumAddress(value.trim());
  }, []);

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <Modal.Content>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('From')}</span></h3>

            <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will sign tx.')}
                isDisabled={!!propSenderId}
                label={t<string>('account')}
                onChange={setSenderId}
                type='account'
            />

            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('To')}</span></h3>
            <Input
                autoFocus
                className='full'
                help={t<string>('The the Ethereum address (starting by "0x")')}
                label={t<string>('Ethereum address')}
                onChange={onChangeEthereumAddress}
                value={ethereumAddress || ''}
            />
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('Amount')}</span></h3>
            
            <InputBalance
              autoFocus
              help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
              isError={!hasAvailable}
              label={t<string>('amount')}
              onChange={setAmount}
              withMax
            />
            <Button.Group>
              <TxButton
                accountId={senderId}
                icon='paper-plane'
                label={t<string>('Transfer')}
                params={[amount, ethereumAddress, 0]}
                tx={api.tx.bridgeTransfer?.transferNative}
              />
            </Button.Group>
          </Modal.Content>
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
