// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Trans, withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { connect } from 'redux-bundler-react';

import AskToEnable from '../components/ask/AskToEnable';
import Box from '../components/box/Box';
import IsNotConnected from '../components/is-not-connected/IsNotConnected';
import withTour from '../components/tour/withTour';
import { getJoyrideLocales } from '../helpers/i8n';
import { statusTour } from '../lib/tours';
import BandwidthStatsDisabled from './BandwidthStatsDisabled';
import NetworkTraffic from './NetworkTraffic';
import NodeBandwidthChart from './NodeBandwidthChart';
import NodeInfo from './NodeInfo';
import NodeInfoAdvanced from './NodeInfoAdvanced';
import StatusConnected from './StatusConnected';

const StatusPage = ({ analyticsAskToEnable,
  doDisableAnalytics,
  doEnableAnalytics,
  handleJoyrideCallback,
  ipfsConnected,
  nodeBandwidthEnabled,
  t,
  toursEnabled }) => {
  return (
    <div className='center'
      data-id='StatusPage'>
      <Box className='pa3 joyride-status-node'
        style={{ minHeight: 0 }}>
        <div className='flex'>
          <div className='flex-auto'>
            <div>
              <StatusConnected />
              <NodeInfo />
              <div className='pt2'>
                <NodeInfoAdvanced />
              </div>
            </div>
          </div>
        </div>
      </Box>
      { ipfsConnected && analyticsAskToEnable &&
        <AskToEnable
          className='mt3'
          detailsLabel={t('app:actions.moreInfo')}
          detailsLink='#/settings/analytics'
          label={t('AskToEnable.label')}
          noLabel={t('app:actions.noThanks')}
          onNo={doDisableAnalytics}
          onYes={doEnableAnalytics}
          yesLabel={t('app:actions.ok')} />
      }
      <div style={{ opacity: ipfsConnected ? 1 : 0.4 }}>
        { nodeBandwidthEnabled
          ? <Box className='mt3 pa3'>
            <div className='flex flex-column flex-row-l joyride-status-charts'>
              <div className='pr0 pr2-l flex-auto'>
                <NodeBandwidthChart />
              </div>
              <div className='dn db-l pl3 pr5'>
                <NetworkTraffic />
              </div>
            </div>
          </Box>
          : <BandwidthStatsDisabled />
        }
        <ReactJoyride
          callback={handleJoyrideCallback}
          continuous
          locale={getJoyrideLocales(t)}
          run={toursEnabled}
          scrollToFirstStep
          showProgress
          steps={statusTour.getSteps({ t, Trans })}
          styles={statusTour.styles} />
      </div>
    </div>
  );
};

export default connect(
  'selectIpfsConnected',
  'selectNodeBandwidthEnabled',
  'selectAnalyticsAskToEnable',
  'selectToursEnabled',
  'doEnableAnalytics',
  'doDisableAnalytics',
  withTour(withTranslation('status')(StatusPage))
);
