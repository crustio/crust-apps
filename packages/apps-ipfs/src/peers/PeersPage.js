// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { connect } from 'redux-bundler-react';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import withTour from '../components/tour/withTour';
import { peersTour } from '../lib/tours';
import { getJoyrideLocales } from '../helpers/i8n';

// Components
import Box from '../components/box/Box';
import WorldMap from './WorldMap/WorldMap';
import PeersTable from './PeersTable/PeersTable';
import AddConnection from './AddConnection/AddConnection';
import CliTutorMode from '../components/cli-tutor-mode/CliTutorMode';
import { cliCmdKeys, cliCommandList } from '../bundles/files/consts';

const PeersPage = ({ handleJoyrideCallback, isCliTutorModeEnabled, t, toursEnabled }) => (
  <div className='overflow-hidden'
    data-id='PeersPage'>
    <div className='flex justify-end items-center mb3'>
      <CliTutorMode command={cliCommandList[cliCmdKeys.ADD_NEW_PEER]()}
        showIcon={true}
        t={t}/>
      <AddConnection />
    </div>

    <Box className='pt3 ph3 pb4'>
      <WorldMap className='joyride-peers-map' />
      <PeersTable className='joyride-peers-table' />
    </Box>

    <ReactJoyride
      callback={handleJoyrideCallback}
      continuous
      locale={getJoyrideLocales(t)}
      run={toursEnabled}
      scrollToFirstStep
      showProgress
      steps={peersTour.getSteps({ t })}
      styles={peersTour.styles} />
  </div>
);

export default connect(
  'selectToursEnabled',
  'selectIsCliTutorModeEnabled',
  withTour(withTranslation('peers')(PeersPage))
);
