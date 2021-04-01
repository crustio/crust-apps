// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { Available, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  accountId: string | null;
  onClose: () => void;
}

function AddCollateral ({ accountId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Add collateral')}
      size='large'
    >
      <Modal.Content>
        <Modal.Content>
          <Modal.Columns>
            <InputAddress
              defaultValue={accountId}
              isDisabled
              label={t<string>('account')}
            />
          </Modal.Columns>
        </Modal.Content>
        {(
          <Modal.Content>
            <Modal.Columns>
              <InputBalance
                autoFocus
                isError={!maxAdditional || maxAdditional.eqn(0)}
                label={t<string>('add collateral')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t<string>('transferrable')}</span>}
                    params={accountId}
                  />
                }
                onChange={setMaxAdditional}
              />
            </Modal.Columns>
          </Modal.Content>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO)}
          label={t<string>('Add collateral')}
          onStart={onClose}
          params={[maxAdditional]}
          tx={api.tx.market.addCollateral}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(AddCollateral);
