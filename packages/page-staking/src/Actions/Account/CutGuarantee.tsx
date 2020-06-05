// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CutNominateInfo } from '../partials/types';
import { SortedTargets } from '../../types';

import React, { useState } from 'react';
import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import NominatePartial from '../partials/CutGuarantee';

interface Props {
  controllerId: string;
  next?: string[];
  nominating?: string[];
  onClose: () => void;
  stashId: string;
  targets: SortedTargets;
  validators?: string[];
}

function CutGuarantee ({ controllerId, next, nominating, onClose, stashId, targets, validators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ cutNominateTx }, setTx] = useState<CutNominateInfo>({});

  return (
    <Modal
      header={t<string>('CutGuarantee Validators')}
      size='large'
    >
      <Modal.Content>
        <NominatePartial
          controllerId={controllerId}
          next={next}
          nominating={nominating}
          onChange={setTx}
          stashId={stashId}
          targets={targets}
          validators={validators}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          extrinsic={cutNominateTx}
          icon='hand paper outline'
          isDisabled={!cutNominateTx}
          isPrimary
          label={t<string>('CutGuarantee')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(CutGuarantee);
