// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react/index';
import Popup from 'reactjs-popup';

import { Icon } from '@polkadot/react-components';

const CruTooltip: React.FC = () => {
  const createIndex = (index: number) => <span style={{ fontSize: 8, verticalAlign: 'text-top' }}> {index}</span>;
  const createRow = (idx: number, txt: string, desc: string) => <span style={{ whiteSpace: 'nowrap' }}>{`1.0 ${txt} = 1.0 ${desc}  = 1x10`}{createIndex(idx)}{' CRU'} </span>;

  return <Popup
    className='my-popup dib-l'
    closeOnDocumentClick
    on={['hover', 'focus']}
    position={['top center']}
    trigger={<span>&nbsp;&nbsp;<Icon icon='question-circle' /></span>}
  >
    <>
      {createRow(-12, 'pCRU', 'pico CRU')}
      <br/>
      {createRow(-9, 'nCRU', 'nano CRU')}
      <br/>
      {createRow(-6, 'µCRU', 'micro CRU')}
      <br/>
      {createRow(-3, 'mCRU', 'milli CRU')}
      <br/>
    </>

  </Popup>;
};

export default CruTooltip;
