// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import './countDown.css';

export interface CountDownType {
    day: number,
    hour_ten: number,
    hour_one: number,
    minute_ten: number,
    minute_one: number,
    second_ten: number,
    second_one: number
}

interface Props {
}

function CountDown({ }: Props): React.ReactElement<Props> {
    const { t, i18n } = useTranslation();
    const endDate = Date.parse('2021-06-25 14:00');

    const [{ day, hour_ten, hour_one, minute_ten, minute_one, second_ten, second_one }, setCountdownInfo] = useState<CountDownType>({
        day: 0,
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
            if (remaining > 1000) {
                remaining -= 1000;
                const hour = Math.floor((remaining / 1000 / 3600) % 24)
                const minute = Math.floor((remaining / 1000 / 60) % 60)
                const second = Math.floor(remaining / 1000 % 60)
                setCountdownInfo({
                    day: Math.floor((remaining / 1000 / 3600) / 24),
                    hour_ten: Math.floor(hour/10),
                    hour_one: hour %10,
                    minute_ten: Math.floor(minute / 60),
                    minute_one: minute % 10,
                    second_ten: Math.floor(second/10),
                    second_one: second % 10
                })
            } else {
                clearInterval(timer)
            }
        }, 1000)
    }, []);

    return (
        <SummaryBox className={`comingsoon-${i18n.language == 'zh' ? 'zh' : ''}`}>
            <div className="wrap">
                <div className="tittle"><strong>{t<string>('Activity Countdown')}</strong></div>
                <div className="countdown">

                    <div className="bloc-time hours" data-init-value="24">
                        <span className="count-title">{t<string>('Days')}</span>

                        <div className="figure hours hours-1">
                            <span className="top">0</span>
                            <span className="top-back">
                                <span>0</span>
                            </span>
                            <span className="bottom">0</span>
                            <span className="bottom-back">
                                <span>0</span>
                            </span>
                        </div>

                        <div className="figure hours hours-2">
                            <span className="top">{day}</span>
                            <span className="top-back">
                                <span>{day}</span>
                            </span>
                            <span className="bottom">{day}</span>
                            <span className="bottom-back">
                                <span>{day}</span>
                            </span>
                        </div>
                    </div>

                    <div className="bloc-time hours" data-init-value="24">
                        <span className="count-title">{t<string>('Hours')}</span>

                        <div className="figure hours hours-1">
                            <span className="top">{hour_ten}</span>
                            <span className="top-back">
                                <span>{hour_ten}</span>
                            </span>
                            <span className="bottom">{hour_ten}</span>
                            <span className="bottom-back">
                                <span>{hour_ten}</span>
                            </span>
                        </div>

                        <div className="figure hours hours-2">
                            <span className="top">{hour_one}</span>
                            <span className="top-back">
                                <span>{hour_one}</span>
                            </span>
                            <span className="bottom">{hour_one}</span>
                            <span className="bottom-back">
                                <span>{hour_one}</span>
                            </span>
                        </div>
                    </div>

                    <div className="bloc-time min" data-init-value="0">
                        <span className="count-title">{t<string>('Minutes')}</span>

                        <div className="figure min min-1">
                            <span className="top">{minute_ten}</span>
                            <span className="top-back">
                                <span>{minute_ten}</span>
                            </span>
                            <span className="bottom">{minute_ten}</span>
                            <span className="bottom-back">
                                <span>{minute_ten}</span>
                            </span>
                        </div>

                        <div className="figure min min-2">
                            <span className="top">{minute_one}</span>
                            <span className="top-back">
                                <span>{minute_one}</span>
                            </span>
                            <span className="bottom">{minute_one}</span>
                            <span className="bottom-back">
                                <span>{minute_one}</span>
                            </span>
                        </div>
                    </div>

                    <div className="bloc-time sec" data-init-value="0">
                        <span className="count-title">{t<string>('Seconds')}</span>

                        <div className="figure sec sec-1">
                            <span className="top">{second_ten}</span>
                            <span className="top-back">
                                <span>{second_ten}</span>
                            </span>
                            <span className="bottom">{second_ten}</span>
                            <span className="bottom-back">
                                <span>{second_ten}</span>
                            </span>
                        </div>

                        <div className="figure sec sec-2">
                            <span className="top">{second_one}</span>
                            <span className="top-back">
                                <span>{second_one}</span>
                            </span>
                            <span className="bottom">{second_one}</span>
                            <span className="bottom-back">
                                <span>{second_one}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </SummaryBox>
    );
}

export default React.memo(styled(CountDown)`
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
