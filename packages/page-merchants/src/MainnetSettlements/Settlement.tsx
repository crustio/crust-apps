// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/apps/translate';
import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useTxBatch } from '@polkadot/react-hooks';

type PrevProxy = [string];

interface Props {
  className?: string;
  onClose: () => void;
}

interface ValueProps {
  index: number;
  value: PrevProxy;
}

interface NewProxyProps extends ValueProps {
  onChangeCid: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const optTxBatch = { isBatchAll: true };

function createAddProxy (api: ApiPromise, cid: string): SubmittableExtrinsic<'promise'> {
  return api.tx.market.calculateReward(cid);
}

function NewProxy ({ index, onChangeCid, onRemove, value: [cid] }: NewProxyProps): React.ReactElement<NewProxyProps> {
  const { t } = useTranslation();

  const _onChangeCid = useCallback(
    (value: string) => onChangeCid(index, value),
    [index, onChangeCid]
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
        <Input
          label={t<string>('file cid')}
          onChange={_onChangeCid}
          value={cid}
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

function Settlement ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [batchAdded, setBatchAdded] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const [txs, setTxs] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const [added, setAdded] = useState<PrevProxy[]>([]);
  const extrinsics = useTxBatch(txs, optTxBatch);
  const { allAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect((): void => {
    setBatchAdded(
      added.map(([cid]) => createAddProxy(api, cid))
    );
  }, [api, added]);

  useEffect((): void => {
    setTxs(() => [...batchAdded]);
  }, [batchAdded]);

  const _addProxy = useCallback(
    () => setAdded((added) =>
      [...added, [
        added.length
          ? added[added.length - 1][0]
          : ''
      ]]
    ),
    []
  );

  const _delProxy = useCallback(
    (index: number) => setAdded((added) => added.filter((_, i) => i !== index)),
    []
  );

  const _changeProxyAccount = useCallback(
    (index: number, cid: string) => setAdded((prevState) => {
      const newState = [...prevState];

      newState[index][0] = cid;

      return newState;
    }),
    []
  );

  return (
    <Modal
      className={className}
      header={t<string>('Settlement overview')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns >
          <InputAddress
            filter={allAccounts}
            label={t<string>('account')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
        </Modal.Columns>
        <Modal.Columns >

          {added.map((value, index) => (
            <NewProxy
              index={index}
              key={`${value.toString()}-${index}`}
              onChangeCid={_changeProxyAccount}
              onRemove={_delProxy}
              value={value}
            />
          ))}
          <Button.Group>
            <Button
              icon='plus'
              label={t<string>('Add settle')}
              onClick={_addProxy}
            />
          </Button.Group>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={extrinsics}
          icon='sign-in-alt'
          isDisabled={!batchAdded.length}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Settlement)`
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
