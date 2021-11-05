// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { useTranslation } from '@polkadot/apps/translate';
import React from 'react';

interface Props {
    className?: string;
    isDisabled?: boolean;
    apy: number;
}

function ApyInfoDisplay({ className = '', apy}: Props): React.ReactElement<Props> | null {
    const { t } = useTranslation();
    
    return (
        <div>
            <tr className={className}>
                {t<string>('Return estimation compunding everyday')}
            </tr>
            <hr />
            <div style={{ alignItems : "center" }}>
                <table style={{ margin: "0 auto",  display: "table" }}>
                    <tr>       
                        <td>{t<string>('Staking time')}</td>
                        <td>{t<string>('Return Per 1000CRU')}</td>
                    </tr>
                    <tr>
                        <td>{t<string>('1d')}</td>
                        <td>{Math.pow((1 + apy), 1) * 1000 - 1000 } CRU</td>
                    </tr>
                    <tr>
                        <td>{t<string>('7d')}</td>
                        <td>{Math.pow((1 + apy), 7) * 1000 - 1000 } CRU</td>
                    </tr>
                    <tr>
                        <td>{t<string>('30d')}</td>
                        <td>{Math.pow((1 + apy), 30) * 1000 - 1000 } CRU</td>
                    </tr>
                    <tr>
                        <td>{t<string>('365d')}</td>
                        <td>{Math.pow((1 + apy), 365) * 1000 - 1000 } CRU</td>
                    </tr>     
                </table>
            </div>
            <hr />
            <tr className={className}>
                {t<string>('Calculated based on current rates,all figures are estimates provided for your convenience only, and by no means represent guaranteed returns')}
            </tr>
        </div>
    );
}

export default React.memo(ApyInfoDisplay);
