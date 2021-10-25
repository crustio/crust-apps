// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import FileSaver from 'file-saver';
import filesize from 'filesize';
import _ from 'lodash';
import { CID } from 'multiformats/cid';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { getPerfix, useFiles, WrapLoginUser } from '@polkadot/app-files/hooks';
import { useAuthPinner } from '@polkadot/app-files/useAuth';
import { createIpfsApiEndpoints } from '@polkadot/apps-config';
import { Badge, Button as RCButton, CopyButton, Dropdown, Password, Spinner, StatusContext, Table } from '@polkadot/react-components';
import { ActionStatusBase, QueueProps } from '@polkadot/react-components/Status/types';

import { Button } from './btns';
import { useTranslation } from './translate';
import { SaveFile } from './types';

const MSpinner = styled(Spinner)`
  height: 20px;
  width: 20px;
  margin-left: 0px;
  margin-right: 10px;
`;

const MCopyButton = styled(CopyButton)`
  display: inline-block;
  margin-left: 8px;
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

function createUrl (f: SaveFile) {
  const endpoint = f.UpEndpoint || 'https://ipfs.io';

  return `${endpoint}/ipfs/${f.Hash}?filename=${f.Name}`;
}

const createOnDown = (f: SaveFile) => () => {
  window.open(createUrl(f), '_blank');
  // FileSaver.saveAs(createUrl(f), f.Name);
};

const shortStr = (name?: string, count = 6): string => {
  if (!name) return '-';

  if (name.length > (count * 2)) {
    return `${name.substr(0, count)}...${name.substr(name.length - count)}`;
  }

  return name;
};

export interface Props {
  className?: string,
  user: WrapLoginUser,
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void
type OnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => void

function CrustPinner ({ className, user }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext<QueueProps>(StatusContext);
  const [isBusy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [cidObject, setCidObject] = useState({ cid: '', prefetchedSize: 0 });
  const [validatingCID, setValidatingCID] = useState(false);
  const [isValidCID, setValidCID] = useState(false);
  const [CIDTips, setCIDTips] = useState({ tips: '', level: 'info' });
  const ipfsApiEndpoint = createIpfsApiEndpoints(t)[0];

  useEffect(() => {
    let cancelTokenSource: CancelTokenSource | null;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async function () {
      const cid = cidObject.cid;

      if (_.isEmpty(cid)) {
        setValidCID(false);
        setCIDTips({ tips: '', level: 'info' });

        return;
      }

      setCIDTips(t('Checking CID...'));
      let isValid = false;

      try {
        const cidObj = CID.parse(cid);

        isValid = CID.asCID(cidObj) != null;
      } catch (error) {
        // eslint-disable-next-line
        console.log(`Invalid CID: ${error.message}`);
      }

      if (!isValid) {
        setValidCID(false);
        setCIDTips({ tips: t('Invalid CID'), level: 'warn' });

        return;
      }

      setCIDTips({ tips: t('Retrieving file size...'), level: 'info' });

      let fileSize = 0;

      try {
        setValidatingCID(true);
        cancelTokenSource = axios.CancelToken.source();
        const res: AxiosResponse = await axios.request({
          cancelToken: cancelTokenSource.token,
          method: 'POST',
          url: `${ipfsApiEndpoint.baseUrl}/api/v0/files/stat?arg=/ipfs/${cid}`,
          timeout: 30000
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        fileSize = _.get(res, 'data.CumulativeSize', 0);

        if (fileSize > 5 * 1024 * 1024 * 1024) {
          setValidCID(false);
          setCIDTips({ tips: t('File size exceeds 5GB'), level: 'warn' });
        } else if (fileSize > 2 * 1024 * 1024 * 1024) {
          setValidCID(true);
          setCIDTips({ tips: t('Note: File may be oversize for full network capability and performance'), level: 'warn' });
        } else {
          setValidCID(true);
          setCIDTips({ tips: `${t('File Size')}: ${fileSize} Bytes`, level: 'info' });
        }

        setCidObject({ cid, prefetchedSize: fileSize });
        setValidatingCID(false);
        cancelTokenSource = null;
      } catch (error) {
        console.error(error);

        if (axios.isCancel(error)) {
          return;
        }

        fileSize = 2 * 1024 * 1024 * 1024;
        setValidCID(true);
        setCIDTips({ tips: t('Unknown File'), level: 'warn' });
        setValidatingCID(false);
        cancelTokenSource = null;
      }
    })();

    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Ipfs api request cancelled');
      }

      cancelTokenSource = null;

      setValidatingCID(false);
      setBusy(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cidObject.cid]);

  const onChangeCID = useCallback<OnInputChange>((e) => {
    const cid = (e.target.value ?? '').trim();

    setCidObject({ cid, prefetchedSize: 0 });
  }, []);

  const wFiles = useFiles('pins:files');
  const { onChangePinner, pinner, pins } = useAuthPinner();
  const onClickPin = useCallback(async () => {
    try {
      if (!isValidCID || !user.sign || (user.isLocked && !password)) return;
      setBusy(true);
      const prefix = getPerfix(user);
      const msg = user.wallet === 'near' ? user.pubKey || '' : user.account;
      const signature = await user.sign(msg, password);
      const perSignData = user.wallet === 'elrond' ? signature : `${prefix}-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const AuthBearer = `Bearer ${base64Signature}`;

      await axios.request({
        data: {
          cid: cidObject.cid
        },
        headers: { Authorization: AuthBearer },
        method: 'POST',
        url: `${pinner.value}/psa/pins`
      });
      const filter = wFiles.files.filter((item) => item.Hash !== cidObject.cid);

      wFiles.setFiles([{
        Hash: cidObject.cid,
        Name: '',
        Size: cidObject.prefetchedSize.toString(),
        UpEndpoint: '',
        PinEndpoint: pinner.value
      }, ...filter]);
      setCidObject({ cid: '', prefetchedSize: 0 });
      setCIDTips({ tips: '', level: 'info' });
      setBusy(false);
    } catch (e) {
      setBusy(false);
      queueAction({
        status: 'error',
        message: t('Error'),
        action: t('Pin')
      });
    }
  }, [isValidCID, pinner, cidObject, queueAction, user, password, wFiles, t]);

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
          if (item.Hash && item.PinEndpoint) {
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

  const _export = useCallback(() => {
    const blob = new Blob([JSON.stringify(wFiles.files)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, 'pins.json');
  }, [wFiles]);

  return <main className={className}>
    <header>
      <div className='inputPanel'>
        <div className='inputCIDWithTips'>
          <input
            className={'inputCID'}
            onChange={onChangeCID}
            placeholder={t('Enter CID')}
            value={cidObject.cid}
          />
          {CIDTips.tips && <div className='inputCIDTipsContainer'>
            {validatingCID && <MSpinner noLabel />}
            <div className={`inputCIDTips ${CIDTips.level !== 'info' ? 'inputCIDTipsWarn' : ''}`}>
              {CIDTips.tips}
            </div>
          </div>}
        </div>
        <Dropdown
          help={t<string>('Your file will be pinned to IPFS for long-term storage.')}
          isDisabled={true}
          label={t<string>('Select a Web3 IPFS Pinner')}
          onChange={onChangePinner}
          options={pins}
          value={pinner.value}
        />
        {
          user.isLocked &&
          <Password
            help={t<string>('The account\'s password specified at the creation of this account.')}
            isError={false}
            label={t<string>('Password')}
            onChange={setPassword}
            value={password}
          />
        }
        <Button
          className={'btnPin'}
          disable={isBusy || !isValidCID || (user.isLocked && !password)}
          isBuzy={isBusy}
          label={t('Pin')}
          onClick={onClickPin}/>
      </div>
    </header>
    <div className={'importExportPanel'}>
      <input
        onChange={_onInputImportFile}
        ref={importInputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      <RCButton
        icon={'file-import'}
        label={t('Import')}
        onClick={_clickImport}
      />
      <RCButton
        icon={'file-export'}
        label={t('Export')}
        onClick={_export}
      />
    </div>
    <Table
      empty={t<string>('empty')}
      emptySpinner={t<string>('Loading')}
      header={[
        [t('Pins'), 'start', 2],
        [t('File Size'), 'expand', 2],
        [t('Status'), 'expand'],
        [t('Action'), 'expand'],
        []
      ]}
    >
      {wFiles.files.map((f, index) =>
        <ItemFile key={`files_item-${index}`}>
          <td
            className='start'
            colSpan={2}
          >
            {shortStr(f.Hash)}
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
          >{(_.isEmpty(f.Size) || Number(f.Size) === 0) ? '-' : filesize(Number(f.Size), { round: 2 })}</td>
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
                onClick={createOnDown(f)}
              />
              <MCopyButton value={createUrl(f)}>
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

export default React.memo<Props>(styled(CrustPinner)`
  h1 {
    text-transform: unset !important;
  }

  .inputPanel {
    background: #FFFFFF;
    border-radius: 2px;
    padding: 1.6rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 1.5rem;

    .inputCIDWithTips {
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;

      .inputCID {
        line-height: 60px;
        border-radius: 4px;
        border: 1px solid #CCCCCC;
        padding-left: 1rem;
        font-size: 18px;
        height: 60px;
        outline: none;

        &:focus {
          border-color: #85b7d9;
        }
      }

      .inputCIDTipsContainer {
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .inputCIDTips {
          text-align: left;
        }

        .inputCIDTipsWarn {
          color: red;
        }
      }
    }

    .ui--Labelled {
      padding-left: 1.6rem;
      flex: 1;
      height: 60px;

      label {
        left: 2.9rem !important;
      }

      .ui--Labelled-content {
        height: 100%;

        div[role="listbox"] {
          height: 100%;
          padding: unset !important;
          margin: unset !important;
        }

        .text {
          font-size: 16px;
          font-weight: 500;
          margin-left: 1.3rem;
          margin-top: 2.2rem;
          color: #333333;
        }
      }
    }

    .ui--Password {
      flex: 1;
      height: 60px;

      .ui.input {
        height: 100%;
        margin: unset !important;
      }
    }

    .btnPin {
      height: 60px;
      margin-left: 1.6rem;
      font-size: 20px;
      width: 160px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 30px;
      border-radius: 4px;
      padding: 1rem 5rem;
      flex-shrink: 0;
    }
  }

  .importExportPanel {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1.5rem;
  }
`);
