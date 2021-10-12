// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useMemo, useState } from 'react';

import { getPerfix, WrapLoginUser } from '@polkadot/app-files/hooks';
import { useAuthGateway, useAuthPinner } from '@polkadot/app-files/useAuth';
import { Button, Dropdown, Label, Modal, Password } from '@polkadot/react-components';

import Progress from './Progress';
import { useTranslation } from './translate';
import { DirFile, FileInfo, SaveFile, UploadRes } from './types';

export interface Props {
  file: FileInfo,
  onClose?: () => void,
  onSuccess?: (res: SaveFile) => void,
  user: WrapLoginUser,
}

const NOOP = (): void => undefined;

function ShowFile (p: { file: DirFile | File }) {
  const f = p.file as DirFile;

  return (
    <div
      style={{
        padding: '5px 2rem',
        backgroundColor: 'white',
        borderRadius: '4px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
      }}>
      <Label label={f.webkitRelativePath || p.file.name}/>
      <span>{`${f.size} bytes`}</span>
    </div>
  );
}

function UploadModal (p: Props): React.ReactElement<Props> {
  const { file, onClose = NOOP, onSuccess = NOOP, user } = p;
  const { t } = useTranslation();
  const { endpoint, endpoints, onChangeEndpoint } = useAuthGateway();
  const { onChangePinner, pinner, pins } = useAuthPinner();
  const [password, setPassword] = useState('');
  const [isBusy, setBusy] = useState(false);
  const fileSizeError = useMemo(() => {
    const MAX = 100 * 1024 * 1024;

    if (file.file) {
      return file.file.size > MAX;
    } else if (file.files) {
      let sum = 0;

      for (const f of file.files) {
        sum += f.size;
      }

      return sum > MAX;
    }

    return false;
  }, [file]);
  // const fileSizeError = file.size > 100 * 1024 * 1024;
  const [error, setError] = useState('');
  const errorText = fileSizeError ? t<string>('Do not upload files larger than 100MB!') : error;
  const [upState, setUpState] = useState({ progress: 0, up: false });
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);

  const _onClose = useCallback(() => {
    if (cancelUp) cancelUp.cancel();
    onClose();
  }, [cancelUp, onClose]);

  const _onClickUp = useCallback(async () => {
    setError('');

    if (!user.account || !user.sign) {
      return;
    }

    try {
      // 1: sign
      setBusy(true);

      const prefix = getPerfix(user);
      const msg = user.wallet === 'near' ? user.pubKey || '' : user.account;
      const signature = await user.sign(msg, password);
      const perSignData = user.wallet === 'elrond' ? signature : `${prefix}-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const AuthBasic = `Basic ${base64Signature}`;
      const AuthBearer = `Bearer ${base64Signature}`;
      // 2: up file
      const cancel = axios.CancelToken.source();

      setCancelUp(cancel);
      setUpState({ progress: 0, up: true });
      const form = new FormData();

      if (file.file) {
        form.append('file', file.file, file.file.name);
      } else if (file.files) {
        for (const f of file.files) {
          form.append('file', f, f.webkitRelativePath);
        }
      }

      const UpEndpoint = endpoint.value;
      const upResult = await axios.request<UploadRes | string>({
        cancelToken: cancel.token,
        data: form,
        headers: { Authorization: AuthBasic },
        maxContentLength: 100 * 1024 * 1024,
        method: 'POST',
        onUploadProgress: (p: { loaded: number, total: number }) => {
          const percent = p.loaded / p.total;

          setUpState({ progress: Math.round(percent * 99), up: true });
        },
        params: { pin: true },
        url: `${UpEndpoint}/api/v0/add`
      });

      let upRes: UploadRes;

      if (typeof upResult.data === 'string') {
        const jsonStr = upResult.data.replaceAll('}\n{', '},{');
        const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
        const folder = items.length - 1;

        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }

      console.info('upResult:', upResult);
      setCancelUp(null);
      setUpState({ progress: 100, up: false });
      // remote pin order
      const PinEndpoint = pinner.value;

      await axios.request({
        data: {
          cid: upRes.Hash,
          name: upRes.Name
        },
        headers: { Authorization: AuthBearer },
        method: 'POST',
        url: `${PinEndpoint}/psa/pins`
      });
      onSuccess({
        ...upRes,
        PinEndpoint,
        UpEndpoint
      });
    } catch (e) {
      setUpState({ progress: 0, up: false });
      setBusy(false);
      console.error(e);
      setError(t('Network Error,Please try to switch a Gateway.'));
      // setError((e as Error).message);
    }
  }, [user, file, password, pinner, endpoint, onSuccess, t]);

  return (
    <Modal
      header={t<string>(file.dir ? 'Upload Folder' : 'Upload File')}
      onClose={_onClose}
      open={true}
      size={'large'}
    >
      <Modal.Content>
        <Modal.Columns>
          <div style={{ paddingLeft: '2rem', width: '100%', maxHeight: 300, overflow: 'auto' }}>
            {
              file.file && <ShowFile file={file.file}/>
            }
            {file.files && file.files.map((f, i) =>
              <ShowFile
                file={f}
                key={`file_item:${i}`}/>
            )}
          </div>
        </Modal.Columns>
        <Modal.Columns>
          <Dropdown
            help={t<string>('File streaming and wallet authentication will be processed by the chosen gateway.')}
            isDisabled={isBusy}
            label={t<string>('Select a Web3 IPFS Gateway')}
            onChange={onChangeEndpoint}
            options={endpoints}
            value={endpoint.value}
          />
        </Modal.Columns>
        <Modal.Columns>
          <Dropdown
            help={t<string>('Your file will be pinned to IPFS for long-term storage.')}
            isDisabled={true}
            label={t<string>('Select a Web3 IPFS Pinner')}
            onChange={onChangePinner}
            options={pins}
            value={pinner.value}
          />
        </Modal.Columns>
        <Modal.Columns>
          {
            !upState.up && user.isLocked &&
            <Password
              help={t<string>('The account\'s password specified at the creation of this account.')}
              isError={false}
              label={t<string>('password')}
              onChange={setPassword}
              value={password}
            />
          }
          <Progress
            progress={upState.progress}
            style={{ marginLeft: '2rem', marginTop: '2rem', width: 'calc(100% - 2rem)' }}
          />
          {
            errorText &&
            <div
              style={{
                color: 'orangered',
                padding: '1rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {errorText}
            </div>
          }
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={_onClose}>
        <Button
          icon={'arrow-circle-up'}
          isBusy={isBusy}
          isDisabled={fileSizeError}
          label={t<string>('Sign and Upload')}
          onClick={_onClickUp}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(UploadModal);
