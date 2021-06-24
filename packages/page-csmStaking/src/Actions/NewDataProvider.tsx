// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BondInfo, SetGuaranteePrefInfo } from './partials/types';

import React, { useCallback, useState } from 'react';

import { useTranslation } from '@polkadot/apps/translate';
import { BatchWarning, Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import BondPartial from './partials/Bond';
import SetGuaranteePref from './partials/SetGuaranteePref';

interface Props {
  isInElection?: boolean;
  providers: string[]
}

const NUM_STEPS = 2;

function NewDataprovider ({ isInElection, providers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [{ accountId, bondTx }, setBondInfo] = useState<BondInfo>({});
  const [{ guaranteePrefTx }, setGuaranteePrefInfo] = useState<SetGuaranteePrefInfo>({});
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
      setGuaranteePrefInfo({});
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
        key='new-data-provider'
        label={t<string>('Data Provider')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t<string>('Setup Data provider {{step}}/{{NUM_STEPS}}', {
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
                onChange={setBondInfo} />
            )}
            {accountId && step === 2 && (
              <>
                <SetGuaranteePref
                  accountId={accountId}
                  onChange={setGuaranteePrefInfo}
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
                  isDisabled={!bondTx || !guaranteePrefTx}
                  label={t<string>('Bond & Set guarantee fee')}
                  onStart={_toggle}
                  params={[
                    [bondTx, guaranteePrefTx]
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

export default React.memo(NewDataprovider);
