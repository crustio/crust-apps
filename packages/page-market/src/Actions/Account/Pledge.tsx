// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  // controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}


function Pledge ({ onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError] = useState<AmountValidateState | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Pledge funds')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('using account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The storage account needs to provide a certain amount of margin to the system before providing resource services, otherwise the storage order cannot be received.')}</p>
          </Modal.Column>
        </Modal.Columns>
        {(
          <Modal.Columns>
            <Modal.Column>
              <InputBalance
                autoFocus
                defaultValue={0}
                // help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
                isError={!!amountError?.error || !maxAdditional || maxAdditional.eqn(0)}
                label={t<string>('Please enter the amount of margin you want to sets')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t<string>('balance')}</span>}
                    params={stashId}
                  />
                }
                onChange={setMaxAdditional}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The amount of margin set by the storage merchant determines the upper limit of the storage order capacity it can accept. The more set, the higher the upper limit. The specific acceptable storage order capacity is negatively related to the storage unit price set by the storage merchant.')}</p>
            </Modal.Column>
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO) || !!amountError?.error}
          label={t<string>('Pledge')}
          onStart={onClose}
          params={[maxAdditional]}
          tx='market.pledge'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Pledge);
