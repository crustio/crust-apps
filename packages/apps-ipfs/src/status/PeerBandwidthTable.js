// [object Object]
// SPDX-License-Identifier: Apache-2.0

import filesize from 'filesize';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import Box from '../components/box/Box';
import ComponentLoader from '../loader/ComponentLoader.js';
import { Title } from './Commons';

const isWindows = window.navigator.appVersion.indexOf('Win') !== -1;
const humansize = filesize.partial({ round: 0 });

export class PeerBandwidthTable extends Component {
  static propTypes = {
    peerBandwidthPeers: PropTypes.array.isRequired,
    peerLocations: PropTypes.object.isRequired
  }

  state = {
    sort: { field: 'rateOut', direction: -1 },
    showAll: false
  }

  getSorter ({ direction, field }) {
    return (a, b) => {
      if (a.bw[field].gt(b.bw[field])) return direction;
      if (a.bw[field].lt(b.bw[field])) return -direction;

      return 0;
    };
  }

  onFieldClick = (e) => {
    const field = e.currentTarget.getAttribute('data-field');

    this.setState(({ sort }) => {
      const direction = sort.field === field ? -sort.direction : -1;

      return { sort: { field, direction } };
    });
  }

  onShowAllClick = () => {
    this.setState({ showAll: true });
  }

  render () {
    const { className, peerBandwidthPeers, peerLocations, t } = this.props;
    const { showAll, sort } = this.state;
    const sortedPeers = Array.from(peerBandwidthPeers)
      .filter((p) => Boolean(p.bw))
      .sort(this.getSorter(sort));

    const visiblePeers = showAll ? sortedPeers : sortedPeers.slice(0, 5);
    const hiddenPeers = showAll ? [] : sortedPeers.slice(5);

    return sortedPeers.length === 0
      ? (
        <ComponentLoader pastDelay />
      )
      : (
        <Box className={className}>
          <Title>{t('bandwidthByPeer')}</Title>
          <table className='collapse'>
            <tbody>
              <tr className='tl'>
                <th className='f6 pv2 pr3 pl0'
                  colSpan='2'><span className='v-mid'>{t('app:terms.peer')}</span></th>
                <SortableTableHeader field='rateIn'
                  label={t('app:rateIn')}
                  onClick={this.onFieldClick}
                  sort={sort} />
                <SortableTableHeader field='rateOut'
                  label={t('app:rateOut')}
                  onClick={this.onFieldClick}
                  sort={sort} />
                <SortableTableHeader field='totalIn'
                  label={t('app:totalIn')}
                  onClick={this.onFieldClick}
                  sort={sort} />
                <SortableTableHeader field='totalOut'
                  label={t('app:totalOut')}
                  onClick={this.onFieldClick}
                  sort={sort} />
              </tr>
              {visiblePeers.map((p, i) => (
                <tr className={i % 2 ? 'bg-snow-muted' : ''}
                  key={p.id}>
                  <td className='f6 pv2 nowrap'><LocationFlag location={peerLocations[p.id]} /></td>
                  <td className='f6 pv2 ph3 w-100 monospace'>{p.id}</td>
                  <td className='f6 pv2 ph3 nowrap'>{humansize(parseInt(p.bw.rateIn.toFixed(0), 10))}/s</td>
                  <td className='f6 pv2 ph3 nowrap'>{humansize(parseInt(p.bw.rateOut.toFixed(0), 10))}/s</td>
                  <td className='f6 pv2 ph3 nowrap'>{humansize(parseInt(p.bw.totalIn.toFixed(0), 10))}</td>
                  <td className='f6 pv2 ph3 nowrap'>{humansize(parseInt(p.bw.totalOut.toFixed(0), 10))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!showAll && hiddenPeers.length
            ? (
              <button className='sans-serif f5 ma0 buttonv3 ph2 tc pointer underline-hover navy-muted'
                onClick={this.onShowAllClick}>{t('countMore', { count: hiddenPeers.length })}</button>
            )
            : null}
        </Box>
      );
  }
}

function SortableTableHeader ({ field, label, onClick, sort }) {
  return (
    <th className='pv2 ph3 pointer underline-hover nowrap'
      data-field={field}
      onClick={onClick}>
      <span className='f6 v-mid'>{label}</span>
      <SortArrow direction={sort.direction}
        field={field}
        sortField={sort.field} />
    </th>
  );
}

function SortArrow ({ direction, field, sortField }) {
  if (field !== sortField) return null;
  const src = `https://icon.now.sh/triangle${direction === 1 ? 'Up' : 'Down'}`;

  return <img alt={'Sorted ' + (direction === 1 ? 'ascending' : 'descending')}
    className='v-mid'
    src={src} />;
}

function LocationFlag ({ location }) {
  if (!location) return '🏳️‍🌈';

  return (
    <span title={location.country_name}>
      <CountryFlag code={location.country_code}
        svg={isWindows} />
    </span>
  );
}

export default connect(
  'selectPeerBandwidthPeers',
  'selectPeerLocations',
  withTranslation('status')(PeerBandwidthTable)
);
