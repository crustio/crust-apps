// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Modal, TxButton } from '@polkadot/react-components';

import SetBond from './partials/SetBond';
import { BondInfo } from './partials/types';

interface Props {
  className: string,
  accountId: string,
  onClose: () => void;
}

function Bond ({ accountId, className = '', onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ bondTx }, setBondInfo] = useState<BondInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('Bond extra')}
      size='large'
    >
      <Modal.Content>
        <SetBond
          accountId={accountId}
          className='nominatePartial'
          onChange={setBondInfo}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={bondTx}
          icon='hand-paper'
          isDisabled={!bondTx}
          label={t<string>('Bond extra')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Bond)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
