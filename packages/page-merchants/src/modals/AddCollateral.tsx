// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '@polkadot/apps/translate';

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
      header= {t<string>('Bond more funds')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={accountId}
              isDisabled
              label={t<string>('account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Since this transaction deals with funding, the stash account will be used.')}</p>
          </Modal.Column>
        </Modal.Columns>
        {(
          <Modal.Columns>
            <Modal.Column>
              <InputBalance
                autoFocus
                help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
                isError={!maxAdditional || maxAdditional.eqn(0)}
                label={t<string>('additional bonded funds')}
                labelExtra={
                  <BalanceFree
                    label={<span className='label'>{t<string>('balance')}</span>}
                    params={accountId}
                  />
                }
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
          accountId={accountId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO)}
          label={t<string>('Add collateral')}
          onStart={onClose}
          params={[maxAdditional]}
          tx={api.tx.market.pledgeExtra}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(AddCollateral);
