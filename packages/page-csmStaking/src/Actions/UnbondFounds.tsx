// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Modal, TxButton } from '@polkadot/react-components';

import { UnbondInfo } from './partials/types';
import Unbond from './partials/Unbond';

interface Props {
  className?: string;
  accountId: string;
  onClose: () => void;
}

function UnbondFounds ({ accountId, className = '', onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ unbondTx }, setGuaranteePrefInfo] = useState<UnbondInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('Unbond founds')}
      size='large'
    >
      <Modal.Content>
        <Unbond
          accountId={accountId}
          className='nominatePartial'
          onChange={setGuaranteePrefInfo}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={unbondTx}
          icon='unlock'
          isDisabled={!unbondTx}
          label={t<string>('Unbond')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(UnbondFounds)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
