// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { connect } from 'redux-bundler-react';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import withTour from '../components/tour/withTour';
import { welcomeTour } from '../lib/tours';
import { getJoyrideLocales } from '../helpers/i8n';

// Components
import IsConnected from '../components/is-connected/IsConnected';
import IsNotConnected from '../components/is-not-connected/IsNotConnected';
import AboutIpfs from '../components/about-ipfs/AboutIpfs';
import AboutWebUI from '../components/about-webui/AboutWebUI';
import ComponentLoader from '../loader/ComponentLoader.js';

const WelcomePage = ({ apiUrl, handleJoyrideCallback, ipfsConnected, ipfsInitFailed, ipfsReady, t, toursEnabled }) => {
  if (!ipfsInitFailed && !ipfsReady) {
    return <ComponentLoader pastDelay />;
  }

  const isSameOrigin = window.location.origin === apiUrl;

  return (
    <div>
      <div className='lh-copy charcoal'>
        <ConnectionStatus connected={ipfsConnected}
          sameOrigin={isSameOrigin}
          t={t} />
      </div>
      <ReactJoyride
        callback={handleJoyrideCallback}
        locale={getJoyrideLocales(t)}
        run={toursEnabled}
        scrollToFirstStep
        steps={welcomeTour.getSteps({ t })}
        styles={welcomeTour.styles} />
    </div>
  );
};

const ConnectionStatus = ({ connected, sameOrigin, t }) => {
  if (connected) {
    return (
      <div>
        <IsConnected />
        <div className='flex-ns mt3'>
          <div className='mr3-ns lh-copy mid-gray w-50-ns'>
            <AboutWebUI />
          </div>
          <div className='lh-copy mid-gray w-50-ns mt3 mt0-ns'>
            <AboutIpfs />
          </div>
        </div>
      </div>
    );
  }

  return (
    <IsNotConnected />
  );
};

export default connect(
  'selectIpfsInitFailed',
  'selectIpfsConnected',
  'selectIpfsReady',
  'selectApiUrl',
  'selectToursEnabled',
  withTour(withTranslation('welcome')(WelcomePage))
);
