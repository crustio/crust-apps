// [object Object]
// SPDX-License-Identifier: Apache-2.0
import Multiaddr from 'multiaddr';
import React from 'react';

const Address = ({ value }) => {
  if (!value) return null;

  const ma = Multiaddr(value);
  const protos = ma.protoNames().concat(['ipfs', 'p2p']);
  const parts = ma.toString().split('/');

  return (
    <div className='charcoal-muted monospace'>
      {parts.map((chunk, i) => (
        <span key={i}>
          <span className={protos.includes(chunk) ? 'force-select' : 'force-select charcoal'}>{chunk}</span>
          {i < parts.length - 1 ? '/' : ''}
        </span>
      ))}
    </div>
  );
};

export default Address;
