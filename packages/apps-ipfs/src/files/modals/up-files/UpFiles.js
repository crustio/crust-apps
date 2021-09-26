// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  InputAddress,
  Label,
  Modal,
  Password,
} from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import filesize from 'filesize';
import { useTranslation } from 'react-i18next';
import { keyring } from '@polkadot/ui-keyring';
import { web3FromSource } from '@polkadot/extension-dapp';
import { isFunction, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import axios from 'axios';
import Progress from '../../../components/progress/Progress';
import { useThemeClass } from '@polkadot/apps-ipfs/theme';
import useParamDefs from '@polkadot/react-params/Param/useParamDefs';

function ShowFile (p) {
  const f = p.file;

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

export default function UpFiles ({ file, endpoint, onClose, onSuccess }) {
  const theme = useThemeClass();
  const { t } = useTranslation('order');
  const { hasAccounts } = useAccounts();
  const [currentPair, setCurrentPair] = useState(() => keyring.getPairs()[0] || null);
  const [account, setAccount] = useState(null);
  const [{ isInjected }, setAccountState] = useState({ isExternal: false, isHardware: false, isInjected: false });
  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState({ isUsable: true, signer: null });
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

  const [error, setError] = useState('');
  const errorText = fileSizeError ? t('Do not upload files larger than 100MB!') : error;
  const [upState, setUpState] = useState({ up: false, progress: 0 });
  const [cancelUp, setCancelUp] = useState(null);
  const onAccountChange = (nAccount) => {
    if (nAccount) {
      setAccount(nAccount);
      setCurrentPair(keyring.getPair(nAccount));
    }
  };

  useEffect(() => {
    const meta = (currentPair && currentPair.meta) || {};
    const isExternal = meta.isExternal || false;
    const isHardware = meta.isHardware || false;
    const isInjected = meta.isInjected || false;
    const isUsable = !(isExternal || isHardware || isInjected);
    setAccountState({ isExternal, isHardware, isInjected });
    setIsLocked(
      isInjected
        ? false
        : (currentPair && currentPair.isLocked) || false
    );
    setSigner({ isUsable, signer: null });
    // for injected, retrieve the signer
    if (meta.source && isInjected) {
      web3FromSource(meta.source)
        .catch()
        .then((injected) => setSigner({
          isUsable: isFunction(injected?.signer?.signRaw),
          signer: injected?.signer || null
        }))
        .catch(console.error);
    }
  }, [currentPair]);

  const unLock = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          currentPair.decodePkcs8(password);
          resolve(1)
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  };
  const signAndUp = async () => {
    setError('');
    if (!isUsable || !currentPair) {
      return;
    }
    try {
      // 1: sign
      setBusy(true);
      if (isLocked) {
        await unLock();
      }
      let signature = '';
      if (signer && isFunction(signer.signRaw)) {
        const res = await signer.signRaw({
          address: currentPair.address,
          data: stringToHex(currentPair.address),
          type: 'bytes'
        });
        signature = res.signature;
      } else {
        signature = u8aToHex(currentPair.sign(stringToU8a(currentPair.address)));
      }
      const perSignData = `${currentPair.address}:${signature}`;
      const base64Signature = Buffer.from(perSignData).toString('base64');
      const AuthBasic = `Basic ${base64Signature}`;
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

      const upResult = await axios.request({
        method: 'post',
        url: `${endpoint.value}/api/v0/add`,
        params: {
          pin: true
        },
        headers: {
          Authorization: AuthBasic,
        },
        data: form,
        cancelToken: cancel.token,
        onUploadProgress: (p) => {
          const percent = p.loaded / p.total;
          setUpState({ up: true, progress: Math.round(percent * 99) });
        }
      });
      setCancelUp(null);
      setUpState({ progress: 100, up: false });

      let upRes;
      if (typeof upResult.data === 'string') {
        const jsonStr = upResult.data.replaceAll('}\n{', '},{');
        const items = JSON.parse(`[${jsonStr}]`);
        const folder = items.length - 1;
        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }
      onSuccess(upRes);
    } catch (e) {
      setUpState({ progress: 0, up: false });
      setBusy(false);
      console.error(e);
      setError(e.message);
    }
  };
  return <Modal
    className={`order--accounts-Modal ${theme}`}
    header={t(file.dir ? 'Upload Folder' : 'Upload File')}
    size='large'
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
      <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{ padding: 0 }}>{t('noAccount')}</p>}>
        {
          !upState.up &&
          <InputAddress
            label={t('Please choose account')}
            isDisabled={!hasAccounts}
            labelExtra={
              <Available
                label={t('transferrable')}
                params={account}
              />
            }
            defaultValue={account}
            onChange={onAccountChange}
            type='account'
          />
        }
        {
          !upState.up && isLocked && !isInjected && <Password
            help={t('The account\'s password specified at the creation of this account.')}
            isError={false}
            label={t('password')}
            onChange={setPassword}
            value={password}
          />
        }
        {upState.up && <Progress progress={upState.progress}/>}
        {
          errorText && <div style={{
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
            color: 'orangered',
            padding: '1rem'
          }}>{errorText}</div>
        }
      </Modal.Columns>
    </Modal.Content>
    <Modal.Actions onCancel={() => {
      if (cancelUp) cancelUp.cancel();
      onClose();
    }}>
      <Button isDisabled={!hasAccounts || fileSizeError}
              icon='sign-in-alt'
              label={t('Sign And Upload')}
              onClick={() => signAndUp()}
              isBusy={isBusy} />
    </Modal.Actions>
  </Modal>;
}
