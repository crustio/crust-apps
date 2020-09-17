// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {AddressMini, Button, InputAddress, InputBalance, Modal, Static, TxButton} from '@polkadot/react-components';
import {useApi, useToggle} from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import {SubmittableExtrinsic} from "@polkadot/api/types";
import { ApiPromise } from '@polkadot/api';
import BN from "bn.js";

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

function createExtrinsic(api: ApiPromise, targets: string[], amount: BN) {
  return api.tx.utility.batch( targets.map(e => api.tx.staking.guarantee([e, amount])));
}

function Nominate ({ className = '', isDisabled, ownNominators, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [ids, setIds] = useState<IdState | null>(null);
  const [isOpen, toggleOpen] = useToggle();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));

  const filter = useMemo(
    () => (ownNominators || []).map(({ stashId }) => stashId),
    [ownNominators]
  );

  useEffect((): void => {
    api.tx.utility && targets && amount && setExtrinsic(
      () => createExtrinsic(api, targets, amount)
    );
  }, [api, targets, amount]);

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
        label={t<string>('Nominate selected')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Nominate validators')}
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
                <p>{t<string>('One of your available nomination accounts, keyed by the stash. The transaction will be sent from the controller.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Static
                  label={t<string>('selected validators')}
                  value={
                    targets.map((validatorId) => {
                      return <AddressMini
                        className='addressStatic'
                        key={validatorId}
                        value={validatorId}
                      />
                    })
                  }
                />
                {/*{targets.map((validatorId): React.ReactNode =>*/}
                {/*  <InputBalance*/}
                {/*    key={validatorId}*/}
                {/*    autoFocus*/}
                {/*    help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}*/}
                {/*    isZeroable*/}
                {/*    label={t<string>('amount')}*/}
                {/*    onChange={setAmount}*/}
                {/*    withMax*/}
                {/*  />*/}
                {/*)}*/}
                <InputBalance
                  autoFocus
                  help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                  isZeroable
                  label={t<string>('amount')}
                  onChange={setAmount}
                  withMax
                />

              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The selected validators to nominate, either via the "currently best algorithm" or via a manual selection.')}</p>
                <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={ids?.controllerId}
              extrinsic={extrinsic}
              label={t<string>('Nominate')}
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
