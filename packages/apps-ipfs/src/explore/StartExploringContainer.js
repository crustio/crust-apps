// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { connect } from 'redux-bundler-react';
import { StartExploringPage } from 'ipld-explorer-components';
import withTour from '../components/tour/withTour';

const StartExploringContainer = ({
  handleJoyrideCallback,
  toursEnabled
}) => (
  <StartExploringPage
    joyrideCallback={handleJoyrideCallback}
    runTour={toursEnabled} />
);

export default connect(
  'selectToursEnabled',
  withTour(StartExploringContainer)
);
