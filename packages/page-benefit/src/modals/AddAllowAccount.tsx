// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { AccountId, ProxyDefinition, ProxyType } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { BatchWarning, Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useTxBatch } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { useTranslation } from '@polkadot/apps/translate';


type PrevProxy = [AccountId, ProxyType];

interface Props {
  className?: string;
  onClose: () => void;
  previousProxy?: [ProxyDefinition[], BN];
  account: string;
}

interface ValueProps {
  index: number;
  value: PrevProxy;
}

interface NewAllowProps extends ValueProps {
  onChangeAccount: (index: number, value: string | null) => void;
  onRemove: (index: number) => void;
  allowedAccount: string;
}

interface PrevProxyProps extends ValueProps {
  onRemove: (accountId: AccountId, type: ProxyType, index: number) => void;
}

const optTxBatch = { isBatchAll: true };

const EMPTY_EXISTING: [ProxyDefinition[], BN] = [[], BN_ZERO];

function createAddProxy (api: ApiPromise, account: AccountId, type: ProxyType, delay = 0): SubmittableExtrinsic<'promise'> {
  return api.tx.swork.addMemberIntoAllowlist(account)
}

function PrevProxy ({ index, onRemove, value: [accountId, type] }: PrevProxyProps): React.ReactElement<PrevProxyProps> {
  const { t } = useTranslation();

  const _onRemove = useCallback(
    () => onRemove(accountId, type, index),
    [accountId, index, onRemove, type]
  );

  return (
    <div className='proxy-container'>
      <div className='input-column'>
        <InputAddress
          defaultValue={accountId}
          isDisabled
          label={t<string>('proxy account')}
        />
      </div>
      <div className='buttons-column'>
        <Button
          icon='times'
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

function NewAllowAccount ({ index, onChangeAccount, onRemove }: NewAllowProps): React.ReactElement<NewAllowProps> {

  const _onChangeAccount = useCallback(
    (value: string | null) => onChangeAccount(index, value),
    [index, onChangeAccount]
  );

  const _onRemove = useCallback(
    () => onRemove(index),
    [index, onRemove]
  );

  return (
    <div
      className='proxy-container'
      key={`addedProxy-${index}`}
    >
      <div className='input-column'>
        <InputAddress
            onChange={_onChangeAccount}
            type='allPlus'
        />
      </div>
      <div className='buttons-column'>
        <Button
          icon='times'
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

function AddAllowAccount ({ className, onClose, previousProxy: [existing] = EMPTY_EXISTING, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [batchAdded, setBatchAdded] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [txs, setTxs] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const [added, setAdded] = useState<PrevProxy[]>([]);
  const extrinsics = useTxBatch(txs, optTxBatch);

  useEffect((): void => {
    setBatchAdded(
      added.map(([newAccount, newType]) => createAddProxy(api, newAccount, newType))
    );
  }, [api, added]);

  useEffect((): void => {
    setTxs(() => [...batchAdded]);
  }, [batchAdded]);

  const _addAllow = useCallback(
    () => setAdded((added) =>
      [...added, [
        added.length
          ? added[added.length - 1][0]
          : api.createType('AccountId', account),
        api.createType('ProxyType', 0)
      ]]
    ),
    [api, account]
  );

  const _delProxy = useCallback(
    (index: number) => setAdded((added) => added.filter((_, i) => i !== index)),
    []
  );

  const _changeProxyAccount = useCallback(
    (index: number, address: string | null) => setAdded((prevState) => {
      const newState = [...prevState];

      newState[index][0] = api.createType('AccountId', address);

      return newState;
    }),
    [api]
  );

  const isSameAdd = added.some(([accountId]) => accountId.eq(account));

  return (
    <Modal
      className={className}
      header={t<string>('Allow overview')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            isDisabled={true}
            label={t<string>('proxied account')}
            type='account'
            value={account}
          />
        </Modal.Columns>
        <Modal.Columns>
          {added.map((value, index) => (
            <NewAllowAccount
              index={index}
              key={`${value.toString()}-${index}`}
              onChangeAccount={_changeProxyAccount}
              onRemove={_delProxy}
              allowedAccount={account}
              value={value}
            />
          ))}
          <Button.Group>
            <Button
              icon='plus'
              label={t<string>('Add allow')}
              onClick={_addAllow}
            />
          </Button.Group>
        </Modal.Columns>
        <Modal.Columns>
          <BatchWarning />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={account}
          extrinsic={extrinsics}
          icon='sign-in-alt'
          isDisabled={isSameAdd || (!batchAdded.length)}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(AddAllowAccount)`
  .proxy-container {
    display: grid;
    grid-column-gap: 0.5rem;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-bottom: 1rem;

    .input-column {
      grid-column: 1;
    }

    .buttons-column {
      grid-column: 2;
      padding-top: 0.3rem;
    }
  }
`);
