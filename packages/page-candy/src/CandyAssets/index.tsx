// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Card, Columar, InputAddress, InputCandyBalance, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import AvailableCandy from '@polkadot/react-query/AvailableCandy';

interface Props {
  className?: string;
  senderId?: string;
}

function CandyAssets ({ className = '', senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [hasAvailable] = useState(true);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [ ethereumAddress] = useState<string | undefined | null>(null);
  const [ candyAmount, setCandyAmount ] = useState<BN>(BN_ZERO);

  useEffect(() => {
    if (senderId) { 
        api.query.system.account(senderId)
        .then(res => {
            const accountInfo = JSON.parse(JSON.stringify(res));
            setCandyAmount(new BN(Number(accountInfo.data.free).toString()))
        })
    }
  }, [api, senderId])

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <Banner type='warning'>
            <p>{t<string>('Change Candy into CRU at a ratio of 1000:1')}</p>
          </Banner>
          <InputAddress
            defaultValue={propSenderId}
            help={t<string>('The account you will sign tx.')}
            isDisabled={!!propSenderId}
            label={t<string>('account')}
            onChange={setSenderId}
            labelExtra={
                <AvailableCandy
                    label={t('transferrable')}
                    params={senderId}
                />
            }
            type='account'
            />
          <InputCandyBalance
            autoFocus
            isDisabled
            help={t<string>('Type the amount you will to exchange.')}
            isError={!hasAvailable}
            label={t<string>('amount')}
            defaultValue={candyAmount}
            withMax
          />
          <Button.Group>
            <TxButton
              accountId={senderId}
              icon='paper-plane'
              isDisabled={candyAmount?.lte(BN_ZERO)}
              label={t<string>('Exchange')}
              params={[candyAmount, ethereumAddress, 0]}
              tx={api.tx.bridgeTransfer?.transferNative}
            />
          </Button.Group>
        </Card>
      </Columar.Column>
    </Columar>
  </div>);
}

export default React.memo(styled(CandyAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
