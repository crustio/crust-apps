// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { withTranslation } from 'react-i18next';

import GlyphTick from '../../icons/GlyphTick';
import Box from '../box/Box';

export const IsConnected = ({ t }) => {
  return (
    <Box className='pv3 ph4'>
      <div>
        <div className='flex flex-wrap items-center'>
          <GlyphTick className='fill-green'
            role='presentation'
            style={{ height: 76 }} />
          <h1 className='montserrat fw4 charcoal ma0 f3 green'>{t('app:status.connectedToIpfs')}</h1>
        </div>
        <p className='fw6 mt1 ml3-ns w-100'>{t('connected.paragraph1')}</p>
      </div>
    </Box>
  );
};

export default withTranslation('welcome')(IsConnected);
