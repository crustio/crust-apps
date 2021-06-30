// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Modal, TxButton } from '@polkadot/react-components';

import SetGuaranteePref from './partials/SetGuaranteePref';
import { SetGuaranteePrefInfo } from './partials/types';

interface Props {
  className?: string;
  accountId: string;
  onClose: () => void;
}

function GuaranteePref ({ accountId, className = '', onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ guaranteePrefTx }, setGuaranteePrefInfo] = useState<SetGuaranteePrefInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('Guarantee fee')}
      size='large'
    >
      <Modal.Content>
        <SetGuaranteePref
          accountId={accountId}
          className='nominatePartial'
          onChange={setGuaranteePrefInfo}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={guaranteePrefTx}
          icon='hand-paper'
          isDisabled={!guaranteePrefTx}
          label={t<string>('Set guarantee fee')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(GuaranteePref)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
