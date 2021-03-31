// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { Title } from './Commons';
import Speedometer from './Speedometer';

class NetworkTraffic extends React.Component {
  state = {
    downSpeed: {
      filled: 0,
      total: 125000 // Starts with 1 Mb/s max
    },
    upSpeed: {
      filled: 0,
      total: 125000 // Starts with 1 Mb/s max
    }
  }

  componentDidUpdate (_, prevState) {
    const { nodeBandwidth } = this.props;

    const down = nodeBandwidth ? parseInt(nodeBandwidth.rateIn.toFixed(0), 10) : 0;
    const up = nodeBandwidth ? parseInt(nodeBandwidth.rateOut.toFixed(0), 10) : 0;

    if (down !== prevState.downSpeed.filled || up !== prevState.upSpeed.filled) {
      this.setState({
        downSpeed: {
          filled: down,
          total: Math.max(down, prevState.downSpeed.total)
        },
        upSpeed: {
          filled: up,
          total: Math.max(up, prevState.upSpeed.total)
        }
      });
    }
  }

  render () {
    const { t } = this.props;
    const { downSpeed, upSpeed } = this.state;

    return (
      <div>
        <Title>{t('networkTraffic')}</Title>
        <div className='flex flex-column justify-between'
          style={{ maxWidth: 400 }}>
          <div className='mh2 mv3 mt0-l'>
            <Speedometer
              color='#f39021'
              title={t('app:terms.upSpeed')}
              {...upSpeed} />
          </div>
          <div className='mh2 mt3 mt0-l'>
            <Speedometer
              color='#69c4cd'
              title={t('app:terms.downSpeed')}
              {...downSpeed} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  'selectNodeBandwidth',
  withTranslation('status')(NetworkTraffic)
);
