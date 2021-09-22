// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { connect } from 'redux-bundler-react';
import { withTranslation } from 'react-i18next';
import WatchItem from './WatchItem';

const StatusForCID = ({ routeInfo: { params } }) => {
  return <WatchItem watchItem={{ fileCid: params.cid }}/>;
};

export default connect(
  'selectRouteInfo',
  'doAddOrder',
  'doAddOrders',
  'selectWatchList',
  'selectWatchedCidList',
  'doNotifyFilesError',
  withTranslation('order')(StatusForCID)
);
