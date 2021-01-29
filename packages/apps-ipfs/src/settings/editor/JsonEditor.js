// [object Object]
// SPDX-License-Identifier: Apache-2.0
// import 'brace/mode/json';
// import './theme/ipfs_dark';

import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver'
class JsonEditor extends React.Component {
  render () {
    const { onChange, readOnly, value } = this.props;
    const lineHeight = 16;
    const height = Math.max(500, value.split('\n').length * lineHeight);

    return (
      <div className='pv3 blue br2'
        style={{ background: '#0b3a53' }}>
        <AceEditor
          editorProps={{ $blockScrolling: Infinity }}
          fontSize={12}
          height={height + 'px'}
          mode='json'
          onChange={onChange}
          readOnly={readOnly}
          setOptions={{ showLineNumbers: true, tabSize: 2 }}
          showGutter
          showPrintMargin={false}
          theme='ipfs_dark'
          value={value}
          width='100%' />
      </div>
    );
  }
}

export default JsonEditor;
