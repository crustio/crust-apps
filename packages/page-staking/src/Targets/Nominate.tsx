// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import { Button, InputAddress, Modal, TxButton} from '@polkadot/react-components';
import {useApi, useToggle} from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import {SubmittableExtrinsic} from "@polkadot/api/types";
import { ApiPromise } from '@polkadot/api';
import BN from "bn.js";
import TargetGuarantee from './TargetGuarantee';

interface Props {
  className?: string;
  isDisabled: boolean;
  ownNominators?: StakerState[];
  targets: string[];
}

interface IdState {
  controllerId?: string | null;
  stashId: string;
}

function createExtrinsic(api: ApiPromise, targets: string[], amount: Map<string, BN>) {
  let tmp = [];
  for (const entry of amount.entries()) {
    tmp.push([entry[0], entry[1]])
  }
  return api.tx.utility.batch(tmp.map(e => api.tx.staking.guarantee(e)));
}

function Nominate ({ className = '', isDisabled, ownNominators, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [ids, setIds] = useState<IdState | null>(null);
  const [isOpen, toggleOpen] = useToggle();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [targetAmount, setTargetAmount] = useState<Map<string, BN>>(new Map<string, BN>());

  const filter = useMemo(
    () => (ownNominators || []).map(({ stashId }) => stashId),
    [ownNominators]
  );
  
  useEffect((): void => {
    api.tx.utility && targets && setExtrinsic(
      () => createExtrinsic(api, targets, targetAmount)
    );
  }, [api, targets, targetAmount]);

  const _onChangeStash = useCallback(
    (accountId?: string | null): void => {
      const acc = ownNominators && ownNominators.find(({ stashId }) => stashId === accountId);

      setIds(
        acc
          ? { controllerId: acc.controllerId, stashId: acc.stashId }
          : null
      );
    },
    [ownNominators]
  );

  return (
    <>
      <Button
        icon='hand-paper'
        isDisabled={isDisabled || !filter.length || !targets.length}
        label={t<string>('Guarantee selected')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Guarantee validators')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={filter}
                  help={t<string>('Your stash account. The transaction will be sent from the associated controller.')}
                  label={t<string>('the stash account to guarantee with')}
                  onChange={_onChangeStash}
                  value={ids?.stashId}
                />
                <InputAddress
                  isDisabled
                  label={t<string>('the associated controller')}
                  value={ids?.controllerId}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('One of your available guarantee accounts, keyed by the stash. The transaction will be sent from the controller.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                {targets.map((validatorId) => {
                  return <TargetGuarantee 
                    key={validatorId}
                    validatorId={validatorId} 
                    targetAmount={targetAmount}
                    setTargetAmount={setTargetAmount}
                    />
                })}
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The selected validators to guarantee, either via the "currently best algorithm" or via a manual selection.')}</p>
                <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={ids?.controllerId}
              extrinsic={extrinsic}
              label={t<string>('Guarantee')}
              onStart={toggleOpen}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Nominate)`
  .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`);
