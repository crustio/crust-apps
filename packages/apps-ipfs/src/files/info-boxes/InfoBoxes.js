// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';

import AddFilesInfo from './add-files-info/AddFilesInfo';
import CompanionInfo from './companion-info/CompanionInfo';

const InfoBoxes = ({ filesExist, isCompanion, isRoot }) => (
  <div>
    { isRoot && isCompanion && <CompanionInfo /> }
    { isRoot && !filesExist && !isCompanion && <AddFilesInfo /> }
  </div>
);

InfoBoxes.propTypes = {
  isRoot: PropTypes.bool.isRequired,
  isCompanion: PropTypes.bool.isRequired,
  filesExist: PropTypes.bool.isRequired
};

export default InfoBoxes;
