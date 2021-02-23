// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Available, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '@polkadot/apps/translate';

interface Props {
  accountId: string | null;
  onClose: () => void;
}


function RewardMerchant ({ accountId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Reward merchant')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={accountId}
              isDisabled
              label={t<string>('account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={accountId}
                />
              }
            />
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t<string>('Reward Merchant')}
          onStart={onClose}
          params={[]}
          tx={api.tx.market.rewardMerchant}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RewardMerchant);
