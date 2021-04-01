// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './FilePreview.css';

import CID from 'cids';
import classNames from 'classnames';
import isBinary from 'is-binary';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import fromUint8ArrayToString from 'uint8arrays/to-string';

import Button from '../../components/button/Button';
import ComponentLoader from '../../loader/ComponentLoader.js';
import typeFromExt from '../type-from-ext';

const Preview = (props) => {
  const { cid, name, path, size } = props;
  const [, drag] = useDrag({
    item: { name, size, cid, path, type: 'FILE' }
  });

  const type = typeFromExt(name);

  // Hack: Allows for text selection if it's a text file (bypass useDrag)
  const dummyRef = useRef();

  return <div className={ classNames(type !== 'pdf' && type !== 'text' && type !== 'json' && 'dib') }
    ref={type === 'text' ? dummyRef : drag}>
    <PreviewItem {...props}
      type={type} />
  </div>;
};

const PreviewItem = ({ availableGatewayUrl: gatewayUrl, cid, name, onDownload, read, size, t, type }) => {
  const [content, setContent] = useState(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const [buffer, setBuffer] = useState(null);

  const loadContent = useCallback(async () => {
    const readBuffer = buffer || await read();

    if (!buffer) {
      setBuffer(readBuffer);
    }

    const { done, value } = await readBuffer.next();
    const previousContent = content || '';

    const currentContent = previousContent + fromUint8ArrayToString(value);

    setContent(currentContent);

    const hasMore = !done && new TextEncoder().encode(currentContent).length < size;

    setHasMoreContent(hasMore);
  }, [buffer, content, read, size]);

  useEffect(() => {
    loadContent();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const src = `${gatewayUrl}/ipfs/${cid}?filename=${encodeURIComponent(name)}`;
  const className = 'mw-100 mt3 bg-snow-muted pa2 br2 border-box';

  switch (type) {
    case 'audio':
      return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls
          width='100%'>
          <source src={src} />
        </audio>
      );
    case 'pdf':
      return (
        <object className='FilePreviewPDF w-100'
          data={src}
          type='application/pdf'>
          {t('noPDFSupport')}
          <a className='underline-hover navy-muted'
            download
            href={src}
            rel='noopener noreferrer'
            target='_blank'>{t('downloadPDF')}</a>
        </object>
      );
    case 'video':
      return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className={className}
          controls>
          <source src={src} />
        </video>
      );
    case 'image':
      return <img alt={name}
        className={className}
        src={src} />;

    default: {
      const cantPreview = (
        <div className='mt4'>
          <p className='b'>{t('cantBePreviewed')} <span aria-label='sad'
            role='img'>😢</span></p>
          <p>
            <Trans i18nKey='downloadInstead'
              t={t}>
                Try <a className='link blue'
                download
                href={src}
                rel='noopener noreferrer'
                target='_blank' >downloading</a> it instead.
            </Trans>
          </p>
        </div>
      );

      if (size > 1024 * 1024 * 4) {
        return cantPreview;
      }

      if (!content) {
        return <ComponentLoader pastDelay />;
      }

      if (isBinary(content)) {
        loadContent();

        return cantPreview;
      }

      return <>
        <pre className={`${className} overflow-auto monospace`}>
          {content}
        </pre>
        { hasMoreContent && <div className='w-100 flex items-center justify-center'>
          <Button onClick={ loadContent }>
            { t('loadMore')}
          </Button>
          <Button className='mh2'
            onClick={ onDownload }>
            { t('app:actions.download')}
          </Button>
        </div>}
      </>;
    }
  }
};

Preview.propTypes = {
  name: PropTypes.string.isRequired,
  hash: PropTypes.instanceOf(CID),
  size: PropTypes.number.isRequired,
  availableGatewayUrl: PropTypes.string.isRequired,
  read: PropTypes.func.isRequired,
  content: PropTypes.object,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
};

export default connect(
  'selectAvailableGatewayUrl',
  withTranslation('files')(Preview)
);
