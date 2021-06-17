// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { Modal, TxButton } from '@polkadot/react-components';

import CsmGuarantee from './partials/CsmGuarantee';
import { GuaranteeInfo } from './partials/types';
import { useTranslation } from '@polkadot/apps/translate';

interface Props {
  className?: string;
  accountId: string;
  onClose: () => void;
}

function Guarantee ({ className = '', accountId, onClose }: Props): React.ReactElement<Props> | null {
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
          className='nominatePartial'
          accountId={accountId}
          onChange={setTx}
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
