// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react/index';
import Popup from 'reactjs-popup';

import { Icon } from '@polkadot/react-components';

const CruTooltip:React.FC = () => {
  const createIndex = (index: number) => <span style={{ fontSize: 8, verticalAlign: 'text-top' }}> {index}</span>;
  const createRow = (idx: number, txt: string) => <span style={{ whiteSpace: 'nowrap' }}>{`1.0 ${txt}  = 1x10`}{createIndex(idx)}{' CRU'}</span>;

  return <Popup
    className='my-popup dib-l'
    closeOnDocumentClick
    on={['hover', 'focus']}
    position={['top center']}
    trigger={<span>&nbsp;&nbsp;<Icon icon='question-circle' /></span>}
  >
    <>
      {createRow(-12, 'pCRU')}
      <br/>
      {createRow(-9, 'nCRU')}
      <br/>
      {createRow(-6, 'µCRU')}
      <br/>
      {createRow(-3, 'mCRU')}
      <br/>
    </>

  </Popup>;
};

export default CruTooltip;
