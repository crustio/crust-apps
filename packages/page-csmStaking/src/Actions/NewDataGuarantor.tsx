// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BondInfo, GuaranteeInfo } from './partials/types';

import React, { useCallback, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { BatchWarning, Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import BondPartial from './partials/Bond';
import CsmGuarantee from './partials/CsmGuarantee';

interface Props {
  isInElection?: boolean;
  providers: string[];
}

const NUM_STEPS = 2;

function NewDataGuarantor ({ isInElection, providers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [{ accountId, bondTx }, setBondInfo] = useState<BondInfo>({});
  const [{ guaranteeTx }, setGuaranteeInfo] = useState<GuaranteeInfo>({});
  const [step, setStep] = useState(1);
  const isDisabled = isInElection || !isFunction(api.tx.utility?.batch);

  const _nextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const _prevStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  const _toggle = useCallback(
    (): void => {
      setBondInfo({});
      setGuaranteeInfo({});
      setStep(1);
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={isDisabled}
        key='new-data-guarantor'
        label={t<string>('Data Guarantor')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t<string>('Setup Data guarantor {{step}}/{{NUM_STEPS}}', {
            replace: {
              NUM_STEPS,
              step
            }
          })}
          size='large'
        >
          <Modal.Content>
            {step === 1 && (
              <BondPartial
                isGuarantor
                onChange={setBondInfo} />
            )}
            {accountId && step === 2 && (
              <>
                <CsmGuarantee
                  accountId={accountId}
                  onChange={setGuaranteeInfo}
                  providers={providers}
                />
              </>
            )}
            <Modal.Columns>
              <BatchWarning />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={_toggle}>
            <Button
              icon='step-backward'
              isDisabled={step === 1}
              label={t<string>('prev')}
              onClick={_prevStep}
            />
            {step === NUM_STEPS
              ? (
                <TxButton
                  accountId={accountId}
                  icon='sign-in-alt'
                  isDisabled={!bondTx || !guaranteeTx}
                  label={t<string>('Bond & Guarantee')}
                  onStart={_toggle}
                  params={[
                    [bondTx, guaranteeTx]
                  ]}
                  tx={api.tx.utility.batchAll || api.tx.utility.batch}
                />
              )
              : (
                <Button
                  icon='step-forward'
                  isDisabled={!bondTx}
                  label={t<string>('next')}
                  onClick={_nextStep}
                />
              )}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewDataGuarantor);
