// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './PeersTable.css';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CountryFlag from 'react-country-flag';
import { Trans, withTranslation } from 'react-i18next';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { connect } from 'redux-bundler-react';

import Cid from '../../components/cid/Cid';
import { sortByProperty } from '../../lib/sort';

export class PeersTable extends React.Component {
  static propTypes = {
    peerLocationsForSwarm: PropTypes.array,
    className: PropTypes.string,
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      sortBy: 'latency',
      sortDirection: SortDirection.ASC
    };

    this.sort = this.sort.bind(this);
  }

  flagRenderer = (flagCode, isPrivate) => {
    // Check if the OS is Windows to render the flags as SVGs
    // Windows doesn't render the flags as emojis  ¯\_(ツ)_/¯
    const isWindows = window.navigator.appVersion.indexOf('Win') !== -1;

    return (
      <span className='f4 pr2'>
        {isPrivate
          ? '🤝'
          : flagCode
            ? <CountryFlag code={flagCode}
              svg={isWindows} />
            : '🌐'}
      </span>
    );
  }

  locationCellRenderer = ({ rowData }) => {
    const location = rowData.isPrivate
      ? this.props.t('localNetwork')
      : rowData.location
        ? rowData.isNearby
          ? <span>{rowData.location} <span className='charcoal-muted'>({this.props.t('nearby')})</span></span>
          : rowData.location
        : <span className='charcoal-muted fw4'>{this.props.t('app:terms.unknown')}</span>;

    return (
      <span title={ rowData.location || this.props.t('app:terms.unknown')}>
        { this.flagRenderer(rowData.flagCode, rowData.isPrivate) }
        { location }
      </span>
    );
  }

  latencyCellRenderer = ({ cellData }) => {
    const style = { width: '60px' };

    return cellData
      ? <span className='dib tr'
        style={style}>{cellData}ms</span>
      : <span className='dib tr o-40'
        style={style}>-</span>;
  }

  peerIdCellRenderer = ({ cellData }) => (
    <Cid identicon
      value={cellData} />
  )

  notesCellRenderer = ({ cellData }) => {
    if (!cellData) return;

    if (cellData.type === 'BOOTSTRAP_NODE') {
      return this.props.t('bootstrapNode');
    } else if (cellData.type === 'RELAY_NODE') {
      return <Trans
        components={[<Cid identicon
          value={cellData.node} />]}
        defaults='via <0>{node}</0>'
        i18nKey='viaRelay'
        values={{ node: cellData.node }} />;
    }
  }

  connectionCellRenderer = ({ rowData }) => (
    <abbr style={{ textDecoration: 'none' }}
      title={rowData.address}>
      {rowData.connection}
    </abbr>
  )

  rowClassRenderer = ({ index }, peers = []) => {
    const { selectedPeers } = this.props;
    const shouldAddHoverEffect = selectedPeers?.peerIds?.includes(peers[index]?.peerId);

    return classNames('bb b--near-white peersTableItem', index === -1 && 'bg-near-white', shouldAddHoverEffect && 'bg-light-gray');
  }

  sort ({ sortBy, sortDirection }) {
    this.setState({ sortBy, sortDirection });
  }

  render () {
    const { className, peerLocationsForSwarm, t } = this.props;
    const { sortBy, sortDirection } = this.state;

    const sortedList = (peerLocationsForSwarm || []).sort(sortByProperty(sortBy, sortDirection === SortDirection.ASC ? 1 : -1));
    const tableHeight = 400;

    return (
      <div className={`bg-white-70 center ${className}`}
        style={{ height: `${tableHeight}px`, maxWidth: 1764 }}>
        { peerLocationsForSwarm && <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              className='tl fw4 w-100 f6'
              headerClassName='teal fw2 ttu tracked ph2'
              headerHeight={32}
              height={tableHeight}
              rowClassName={(rowInfo) => this.rowClassRenderer(rowInfo, peerLocationsForSwarm)}
              rowCount={peerLocationsForSwarm.length}
              rowGetter={({ index }) => sortedList[index]}
              rowHeight={36}
              sort={this.sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}>
              <Column cellRenderer={this.locationCellRenderer}
                className='f6 navy-muted truncate pl2'
                dataKey='location'
                label={t('app:terms.location')}
                width={450} />
              <Column cellRenderer={this.latencyCellRenderer}
                className='f6 navy-muted monospace pl2'
                dataKey='latency'
                label={t('app:terms.latency')}
                width={250} />
              <Column cellRenderer={this.peerIdCellRenderer}
                className='charcoal monospace truncate f7 pl2'
                dataKey='peerId'
                label={t('app:terms.peerId')}
                width={250} />
              <Column cellRenderer={this.connectionCellRenderer}
                className='f6 navy-muted truncate pl2'
                dataKey='connection'
                label={t('app:terms.connection')}
                width={400} />
              <Column cellRenderer={this.notesCellRenderer}
                className='charcoal monospace truncate f7 pl2'
                dataKey='notes'
                disableSort
                label={t('notes')}
                width={400} />
            </Table>
          )}
        </AutoSizer> }
      </div>
    );
  }
}

export default connect(
  'selectPeerLocationsForSwarm',
  'selectSelectedPeers',
  withTranslation('peers')(PeersTable)
);
