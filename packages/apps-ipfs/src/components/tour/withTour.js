// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { STATUS } from 'react-joyride';
import { connect } from 'redux-bundler-react';

const withTour = (WrappedComponent) => {
  class WithTour extends React.Component {
    handleJoyrideCallback = (data) => {
      const { doDisableTours } = this.props;
      const { action, status } = data;

      if (action === 'close' || [STATUS.FINISHED].includes(status)) {
        doDisableTours();
      }
    };

    render () {
      return <WrappedComponent handleJoyrideCallback={this.handleJoyrideCallback}
        {...this.props} />;
    }
  }

  return connect('doDisableTours', WithTour);
};

export default withTour;
