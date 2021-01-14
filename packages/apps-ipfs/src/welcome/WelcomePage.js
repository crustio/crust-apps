// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { connect } from 'redux-bundler-react';

// Components
import IsNotConnected from '../components/is-not-connected/IsNotConnected';
import withTour from '../components/tour/withTour';
import { getJoyrideLocales } from '../helpers/i8n';
import { welcomeTour } from '../lib/tours';
import ComponentLoader from '../loader/ComponentLoader.js';

const WelcomePage = ({ doUpdateHash, ipfsConnected, ipfsInitFailed, ipfsReady }) => {
  const history = useHistory();

  if (!ipfsInitFailed && !ipfsReady) {
    return <ComponentLoader pastDelay />;
  }

  if (ipfsConnected) {
    history.push('/storage');
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
  'doUpdateHash',
  withTour(withTranslation('welcome')(WelcomePage))
);
