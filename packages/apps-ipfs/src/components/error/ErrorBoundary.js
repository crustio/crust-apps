// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import root from 'window-or-global';

import ErrorIcon from '../../icons/GlyphSmallCancel';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  static defaultProps = {
    fallback: ErrorIcon
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true });
    console.log(error);

    if (root && root.Countly) {
      root.Countly.q.push(['log_error'], error);
    }
  }

  render () {
    const { hasError } = this.state;
    const { children, fallback: Fallback } = this.props;

    return hasError ? <Fallback /> : children;
  }
}

export default ErrorBoundary;
