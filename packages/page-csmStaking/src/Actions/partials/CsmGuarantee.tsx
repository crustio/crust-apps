// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
}

function CsmGuarantee({ className = '', accountId, withSenders, onChange }: Props): React.ReactElement {
    const { t } = useTranslation();
    const { api } = useApi();

    // TODO: change to get from jk's api
    const available = ['5CD8zuY5jDFUFh2eyKcyA63LedEKhy8NckVyztJvVRdQ4PCy'];

    const [selected, setSelected] = useState<string[]>([]);

    useEffect((): void => {
        onChange({
            guaranteeTx: selected && selected.length && selected[0]
                ? api.tx.csmLocking.guarantee([selected[0]])
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
                <Modal.Columns hint={t<string>('Guarantors can be selected manually from the list of all currently available validators.')}>
                    <InputAddressMulti
                        available={available}
                        availableLabel={t<string>('candidate accounts')}
                        // defaultValue={nominating}
                        help={t<string>('Filter available candidates based on name, address or short account index.')}
                        maxCount={1}
                        onChange={setSelected}
                        valueLabel={t<string>('selected accounts')}
                    />
                </Modal.Columns>
            </Modal.Content>
        </div>
    );
}

export default React.memo(CsmGuarantee);
