// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import { useApi, useCall } from '@polkadot/react-hooks';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ActiveEraInfo } from '@polkadot/types/interfaces';
import { useTranslation } from '@polkadot/apps/translate';

export interface CountDownType {
    day_ten: number,
    day_one: number,
    hour_ten: number,
    hour_one: number,
    minute_ten: number,
    minute_one: number,
    second_ten: number,
    second_one: number
}

interface Props {
}

function BoosterCountDown({ }: Props): React.ReactElement<Props> {
    const { api } = useApi();
    const { t } = useTranslation();
    const endDate = Date.parse('2021-07-11 14:00');
    const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

    const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);

    const [{ day_ten, day_one,hour_ten, hour_one, minute_ten, minute_one, second_ten, second_one }, setCountdownInfo] = useState<CountDownType>({
        day_ten: 1,
        day_one: 0,
        hour_ten: 0,
        hour_one: 0,
        minute_ten: 0,
        minute_one: 0,
        second_ten: 0,
        second_one: 0
    });

    useEffect(() => {
        let now_time = new Date().getTime();
        var remaining = endDate - now_time;
        const timer = setInterval(() => {
            if (activeEra >= 756 && remaining > 1000) {
                remaining -= 1000;
                const day = Math.floor((remaining / 1000 / 3600) / 24)
                const hour = Math.floor((remaining / 1000 / 3600) % 24)
                const minute = Math.floor((remaining / 1000 / 60) % 60)
                const second = Math.floor(remaining / 1000 % 60)
                setCountdownInfo({
                    day_ten: Math.floor(day/10),
                    day_one: day % 10,
                    hour_ten: Math.floor(hour/10),
                    hour_one: hour %10,
                    minute_ten: Math.floor(minute / 10),
                    minute_one: minute % 10,
                    second_ten: Math.floor(second/10),
                    second_one: second % 10
                })
            } else {
                clearInterval(timer)
            }
        }, 1000)
    }, [activeEra]);

    return (
        <div style={{display: 'inline-block', 'fontWeight': 'bold', fontSize: '16px',  "wordWrap": "break-word", "wordBreak": "break-all"}}>
            {t<string>('Activities in progress，End time countdown')}
            &nbsp;{day_ten}&nbsp;{day_one}&nbsp;:&nbsp;{hour_ten}&nbsp;{hour_one}&nbsp;:&nbsp;{minute_ten}&nbsp;{minute_one}&nbsp;:&nbsp;{second_ten}&nbsp;{second_one}
        </div>
    );
}

export default React.memo(styled(BoosterCountDown)`
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }
  
`);
