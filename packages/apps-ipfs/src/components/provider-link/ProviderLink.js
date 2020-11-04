// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

const providers = {
  'js-ipfs-api': {
    url: 'https://github.com/ipfs/js-ipfs-api'
  },
  'js-ipfs': {
    url: 'https://github.com/ipfs/js-ipfs'
  },
  'window.ipfs': {
    url: 'https://github.com/ipfs-shipyard/ipfs-companion'
  },
  'ipfs-companion': {
    url: 'https://github.com/ipfs-shipyard/ipfs-companion'
  }
};

const findInfo = (name) => {
  const provider = providers[name];

  return provider || { name };
};

const ProviderLink = ({ name }) => {
  const info = findInfo(name);

  if (!info.url) {
    return <span>{info.name || name}</span>;
  }

  return (
    <a className='link blue'
      href={info.url}
      rel='noopener noreferrer'
      target='_blank'>{info.name || name}</a>
  );
};

export default ProviderLink;
