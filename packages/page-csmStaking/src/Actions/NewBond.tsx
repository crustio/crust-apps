// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BondInfo } from './partials/types';

import React, { useCallback, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import BondPartial from './partials/Bond';

interface Props {
  isInElection?: boolean;
}

function NewBond ({ isInElection }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [{ accountId, bondTx }, setBondInfo] = useState<BondInfo>({});

  const _toggle = useCallback(
    (): void => {
      setBondInfo({});
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='plus'
        key='new-bond'
        label={t<string>('Bond')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t<string>('Bonding Preferences')}
          size='large'
        >
          <Modal.Content>
            <BondPartial
              onChange={setBondInfo} />
          </Modal.Content>
          <Modal.Actions onCancel={_toggle}>
            <TxButton
              accountId={accountId}
              extrinsic={bondTx}
              icon='sign-in-alt'
              isDisabled={!bondTx || !accountId}
              label={t<string>('Bond')}
              onStart={_toggle}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewBond);
