// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import AvailableCollateral from './AvailableCollateral';

interface Props {
  accountId: string | null;
  onClose: () => void;
}

function CutCollateral ({ accountId, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Cut collateral')}
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
                label={t<string>('cut collateral')}
                labelExtra={
                  <AvailableCollateral
                    label={t<string>('collateral')}
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
          label={t<string>('Cut collateral')}
          onStart={onClose}
          params={[maxAdditional]}
          tx={api.tx.market.cutCollateral}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(CutCollateral);
