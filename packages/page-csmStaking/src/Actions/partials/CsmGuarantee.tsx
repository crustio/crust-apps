// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { InputAddress, InputAddressMulti, Modal } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi } from '@polkadot/react-hooks';

import { GuaranteeInfo } from './types';

interface Props {
  className?: string;
  accountId: string;
  onChange: (info: GuaranteeInfo) => void;
  withSenders?: boolean;
  providers: string[];
}

function CsmGuarantee ({ accountId, className = '', onChange, withSenders, providers }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  const [selected, setSelected] = useState<string[]>([]);

  useEffect((): void => {
    onChange({
      guaranteeTx: selected && selected.length && selected[0]
        ? api.tx.csmLocking.guarantee(selected[0])
        : null
    });
  }, [api, onChange, selected]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Content>
          <Modal.Columns hint={t<string>('The account that is to be affected.')}>
            <InputAddress
              defaultValue={accountId}
              isDisabled
              label={t<string>('account')}
            />
          </Modal.Columns>
        </Modal.Content>
      )}
      <Modal.Content>
        <Modal.Columns hint={t<string>('')}>
          <InputAddressMulti
            available={providers}
            availableLabel={t<string>('provider accounts')}
            // defaultValue={nominating}
            help={t<string>('')}
            maxCount={1}
            onChange={setSelected}
            valueLabel={t<string>('selected account')}
          />
        </Modal.Columns>
      </Modal.Content>
    </div>
  );
}

export default React.memo(CsmGuarantee);
