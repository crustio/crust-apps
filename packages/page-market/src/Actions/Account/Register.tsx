// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { InputAddress, InputBalance, Modal, TxButton, Input } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  // controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}


function Register ({ onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError] = useState<AmountValidateState | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();
  const [{ isAddressValid, address }, setAddress] = useState({ isAddressValid: false, address: '' });

  const _onChangeAddress = useCallback(
    (address: string) => setAddress({ isAddressValid: !!address.trim(), address }),
    []
  );

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Merchant register')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Since this transaction deals with funding, the stash account will be used.')}</p>
          </Modal.Column>
        </Modal.Columns>
        {(
          <Modal.Columns>
            <Modal.Column>
              <Input
                autoFocus
                help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
                isError={!isAddressValid}
                label={t<string>('address_info')}
                onChange={_onChangeAddress}
                // onEnter={setAddress}
                placeholder={t<string>('ws://')}
                value={address}
              />
              <InputBalance
                autoFocus
                defaultValue={0}
                help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
                isError={!!amountError?.error || !maxAdditional || maxAdditional.eqn(0)}
                label={t<string>('additional bonded funds')}
                onChange={setMaxAdditional}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The amount placed at-stake should allow some free funds for future transactions.')}</p>
            </Modal.Column>
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO) || !!amountError?.error}
          label={t<string>('Register')}
          onStart={onClose}
          params={[address, maxAdditional]}
          tx='market.register'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Register);
