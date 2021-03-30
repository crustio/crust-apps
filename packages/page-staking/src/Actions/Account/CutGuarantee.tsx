// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../../types';
import type { NominateInfo } from '../partials/types';

import React, { useState } from 'react';
import styled from 'styled-components';

import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import CutGuaranteePartial from '../partials/CutGuarantee';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onClose: () => void;
  stashId: string;
  targets: SortedTargets;
}

function CutGuarantee ({ className = '', controllerId, nominating, onClose, stashId, targets }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ nominateTx }, setTx] = useState<NominateInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('CutGuarantee Validators')}
      size='large'
    >
      <Modal.Content>
        <CutGuaranteePartial
          className='nominatePartial'
          controllerId={controllerId}
          nominating={nominating}
          onChange={setTx}
          stashId={stashId}
          targets={targets}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          extrinsic={nominateTx}
          icon='hand-paper'
          isDisabled={!nominateTx}
          label={t<string>('Cut Guarantee')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(CutGuarantee)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
