// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { ExplorePage } from 'ipld-explorer-components';
import React from 'react';
import { connect } from 'redux-bundler-react';

import withTour from '../components/tour/withTour';

const ExploreContainer = ({ availableGatewayUrl,
  handleJoyrideCallback,
  toursEnabled }) => (
  <ExplorePage
    gatewayUrl={availableGatewayUrl}
    joyrideCallback={handleJoyrideCallback}
    runTour={toursEnabled}
  />
);

export default connect(
  'selectToursEnabled',
  'selectAvailableGatewayUrl',
  withTour(ExploreContainer)
);
