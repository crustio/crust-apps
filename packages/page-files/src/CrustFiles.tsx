// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import FileSaver from 'file-saver';
import filesize from 'filesize';
import React, { useCallback, useContext, useRef, useState } from 'react';
import styled from 'styled-components';

import { useFiles, WrapLoginUser } from '@polkadot/app-files/hooks';
import UploadModal from '@polkadot/app-files/UploadModal';
import { useAuthGateway } from '@polkadot/app-files/useAuth';
import { AuthIpfsEndpoint } from '@polkadot/apps-config/ipfs-gateway-endpoints/types';
import { Badge, Button, CopyButton, Icon, StatusContext, Table } from '@polkadot/react-components';
import { ActionStatusBase, QueueProps } from '@polkadot/react-components/Status/types';

import { useTranslation } from './translate';
import { DirFile, FileInfo, SaveFile } from './types';

const MCopyButton = styled(CopyButton)`
  .copySpan {
    display: none;
  }
`;

const ItemFile = styled.tr`
  height: 3.5rem;

  .end {
    text-align: end;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .fileName {
    .ui--Icon {
      margin-right: 8px;
    }
  }
`;

function createUrl (f: SaveFile, endpoints: AuthIpfsEndpoint[]) {
  const p = endpoints.find((e) => e.value === f.UpEndpoint);
  const endpoint = (p && p.value) || endpoints[0].value;

  return `${endpoint}/ipfs/${f.Hash}?filename=${f.Name}`;
}

const createOnDown = (f: SaveFile, endpoints: AuthIpfsEndpoint[]) => () => {
  window.open(createUrl(f, endpoints), '_blank');
  // FileSaver.saveAs(createUrl(f), f.Name);
};

const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substr(0, count)}...${name.substr(name.length - count)}`;
  }

  return name;
};

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

export interface Props {
  className?: string,
  user: WrapLoginUser,
}

const Noop = (): void => undefined;

function CrustFiles ({ className, user }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { endpoints } = useAuthGateway();
  const { queueAction } = useContext<QueueProps>(StatusContext);
  const [showUpMode, setShowUpMode] = useState(false);
  const wFiles = useFiles();
  const [file, setFile] = useState<FileInfo | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const _clickUploadFile = useCallback((dir = false) => {
    if (!inputRef.current) return;
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    inputRef.current.webkitdirectory = dir;
    // eslint-disable-next-line
    inputRef.current.multiple = dir;
    inputRef.current.click();
  }, [inputRef]);
  const onClickUpFile = useCallback(() => _clickUploadFile(false), [_clickUploadFile]);
  const onClickUpFolder = useCallback(() => _clickUploadFile(true), [_clickUploadFile]);
  const _onInputFile = useCallback<FunInputFile>((e) => {
    const files = e.target.files;

    if (!files) return;

    if (files.length > 2000) {
      queueAction({
        action: t('Upload'),
        message: t('Please do not upload more than 2000 files'),
        status: 'error'
      });

      return;
    }

    if (files.length === 0) {
      queueAction({
        action: t('Upload'),
        message: t('Please select non-empty folder'),
        status: 'error'
      });

      return;
    }

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const isDirectory = e.target.webkitdirectory;

    if (!isDirectory) {
      setFile({ file: files[0] });
      setShowUpMode(true);
    } else if (files.length >= 1) {
      // eslint-disable-next-line
      // @ts-ignore eslint-disable-next-line
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const dirFiles: DirFile[] = [];

      for (let index = 0; index < files.length; index++) {
        // console.info('f:', files[index]);
        dirFiles.push(files[index] as DirFile);
      }

      console.info(dirFiles);

      const [dir] = dirFiles[0].webkitRelativePath.split('/');

      setFile({ files: dirFiles, dir });
      setShowUpMode(true);
    }

    e.target.value = '';
  }, [setFile, setShowUpMode, queueAction, t]);

  const _onImportResult = useCallback<(m: string, s?: ActionStatusBase['status']) => void>(
    (message, status = 'queued') => {
      queueAction && queueAction({
        action: t('Import files'),
        message,
        status
      });
    },
  [queueAction, t]
  );
  const importInputRef = useRef<HTMLInputElement>(null);
  const _clickImport = useCallback(() => {
    if (!importInputRef.current) return;
    importInputRef.current.click();
  }, [importInputRef]);
  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      _onImportResult(t('Importing'));
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) return;
      fileReader.readAsText(files[0], 'UTF-8');

      if (!(/(.json)$/i.test(e.target.value))) {
        return _onImportResult(t('File error'), 'error');
      }

      fileReader.onload = (e) => {
        const _list = JSON.parse(e.target?.result as string) as SaveFile[];

        if (!Array.isArray(_list)) {
          return _onImportResult(t('File content error'), 'error');
        }

        const fitter: SaveFile[] = [];
        const mapImport: { [key: string]: boolean } = {};

        for (const item of _list) {
          if (item.Hash && item.Name && item.UpEndpoint && item.PinEndpoint) {
            fitter.push(item);
            mapImport[item.Hash] = true;
          }
        }

        const filterOld = wFiles.files.filter((item) => !mapImport[item.Hash]);

        wFiles.setFiles([...fitter, ...filterOld]);
        _onImportResult(t('Import Success'), 'success');
      };
    } catch (e) {
      _onImportResult(t('File content error'), 'error');
    }
  }, [wFiles, _onImportResult, t]);

  const _onClose = useCallback(() => {
    setShowUpMode(false);
  }, []);

  const _onSuccess = useCallback((res: SaveFile) => {
    setShowUpMode(false);
    const filterFiles = wFiles.files.filter((f) => f.Hash !== res.Hash);

    wFiles.setFiles([res, ...filterFiles]);
  }, [wFiles]);

  const _export = useCallback(() => {
    const blob = new Blob([JSON.stringify(wFiles.files)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, 'files.json');
  }, [wFiles]);

  return <main className={className}>
    <header>
    </header>
    <input
      onChange={_onInputFile}
      ref={inputRef}
      style={{ display: 'none' }}
      type={'file'}
    />
    <input
      onChange={_onInputImportFile}
      ref={importInputRef}
      style={{ display: 'none' }}
      type={'file'}
    />
    {
      file && showUpMode &&
      <UploadModal
        file={file}
        onClose={_onClose}
        onSuccess={_onSuccess}
        user={user}
      />
    }
    <div style={{ display: 'flex', paddingBottom: '1.5rem' }}>
      <div className='uploadBtn'>
        <Button
          icon={'upload'}
          label={t('Upload')}
          onClick={Noop}
        />
        <div className='uploadMenu'>
          <div
            className='menuItem'
            onClick={onClickUpFile}>{t('File')}</div>
          <div
            className='menuItem'
            onClick={onClickUpFolder}>{t('Folder')}</div>
        </div>
      </div>
      <div style={{ flex: 1 }}/>
      <Button
        icon={'file-import'}
        label={t('Import')}
        onClick={_clickImport}
      />
      <Button
        icon={'file-export'}
        label={t('Export')}
        onClick={_export}
      />
    </div>
    <Table
      empty={t<string>('No files')}
      emptySpinner={t<string>('Loading')}
      header={[
        [t('Files'), 'start', 2],
        [t('File Cid'), 'expand', 2],
        [undefined, 'start'],
        [t('File Size'), 'expand', 2],
        [t('Status'), 'expand'],
        [t('Action'), 'expand'],
        []
      ]}
    >
      {wFiles.files.map((f, index) =>
        <ItemFile key={`files_item-${index}`}>
          <td
            className='fileName'
            colSpan={2}
          >
            {f.items && <Icon
              className='highlight--color'
              icon='folder'/>}
            {shortStr(f.Name)}
          </td>
          <td
            className='end'
            colSpan={2}
          >{shortStr(f.Hash)}</td>
          <td
            className=''
            colSpan={1}
          >
            <MCopyButton value={f.Hash}>
              <Badge
                color='highlight'
                hover={t<string>('Copy File CID')}
                icon='copy'
              />
            </MCopyButton>
          </td>
          <td
            className='end'
            colSpan={2}
          >{filesize(Number(f.Size), { round: 2 }) }</td>
          <td
            className='end'
            colSpan={1}
          >
            <a
              href={`${window.location.origin}/#/storage_files/status/${f.Hash}`}
              rel='noreferrer'
              target='_blank'
            >{t('View status in Crust')}</a>
          </td>
          <td
            className='end'
            colSpan={1}
          >
            <div className='actions'>
              <Badge
                color='highlight'
                hover={t<string>('Open File')}
                icon='external-link-square-alt'
                onClick={createOnDown(f, endpoints)}
              />
              <MCopyButton value={createUrl(f, endpoints)}>
                <Badge
                  color='highlight'
                  hover={t<string>('Copy Download Link')}
                  icon='copy'
                />
              </MCopyButton>

            </div>
          </td>
          <td colSpan={1}/>
        </ItemFile>
      )}
    </Table>
    <div>
      {t('Note: The file list is cached locally, switching browsers or devices will not keep displaying the original browser information.')}
    </div>
  </main>;
}

export default React.memo<Props>(styled(CrustFiles)`
  h1 {
    text-transform: unset !important;
  }
  .uploadBtn {
    position: relative;
    padding: 5px 0;

    &:hover {
      .uploadMenu {
        display: block;
      }
    }
  }

  .uploadMenu {
    z-index: 200;
    display: none;
    background-color: white;
    position: absolute;
    top: 43px;
    left: 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    overflow: hidden;
    line-height: 40px;

    .menuItem {
      cursor: pointer;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      white-space: nowrap;

      &:hover {
        background-color: var(--bg-page);
      }
    }
  }

`);
