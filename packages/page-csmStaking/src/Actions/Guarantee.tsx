// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Modal, TxButton } from '@polkadot/react-components';

import CsmGuarantee from './partials/CsmGuarantee';
import { GuaranteeInfo } from './partials/types';

interface Props {
  className: string,
  accountId: string,
  onClose: () => void;
  providers: string[]
}

function Guarantee ({ accountId, className = '', onClose, providers }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ guaranteeTx }, setTx] = useState<GuaranteeInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('Guarantee')}
      size='large'
    >
      <Modal.Content>
        <CsmGuarantee
          accountId={accountId}
          className='nominatePartial'
          onChange={setTx}
          providers={providers}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={guaranteeTx}
          icon='hand-paper'
          isDisabled={!guaranteeTx}
          label={t<string>('Guarantee')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Guarantee)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
