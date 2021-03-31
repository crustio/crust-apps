// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Trans, withTranslation } from 'react-i18next';

import Box from '../../../components/box/Box';

const CompanionInfo = ({ t }) => (
  <div className='mv4 tc navy f5' >
    <Box style={{ background: 'rgba(105, 196, 205, 0.1)' }}>
      <Trans i18nKey='companionInfo'
        t={t}>
        <p className='ma0'>As you are using <strong>IPFS Companion</strong>, the files view is limited to files added while using the extension.</p>
      </Trans>
    </Box>
  </div>
);

export default withTranslation('files')(CompanionInfo);
