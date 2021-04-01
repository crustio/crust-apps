// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { StartExploringPage } from 'ipld-explorer-components';
import React from 'react';
import { connect } from 'redux-bundler-react';

import FilesExploreForm from '@polkadot/apps-ipfs/files/explore-form/FilesExploreForm';

import withTour from '../components/tour/withTour';

const StartExploringContainer = ({ doExploreUserProvidedPath,
  doFilesNavigateTo,
  handleJoyrideCallback,
  toursEnabled }) => (
  <>
    <div className='flex items-center ph3 ph4-l'
      style={{ WebkitAppRegion: 'drag', height: 75, background: '#F0F6FA', paddingTop: '20px', paddingBottom: '15px' }}>
      <div className='joyride-app-explore'
        style={{ width: 560 }}>
        <FilesExploreForm onBrowse={doFilesNavigateTo}
          onInspect={doExploreUserProvidedPath} />
      </div>
      <div className='dn flex-ns flex-auto items-center justify-end'>
        {/* <TourHelper /> */}
      </div>
    </div>
    <StartExploringPage
      joyrideCallback={handleJoyrideCallback}
      runTour={toursEnabled} />
  </>
);

export default connect(
  'selectToursEnabled',
  'doExploreUserProvidedPath',
  'doFilesNavigateTo',
  withTour(StartExploringContainer)
);
