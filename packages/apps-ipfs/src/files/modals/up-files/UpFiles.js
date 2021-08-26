// Copyright 2017-2021 @polkadot/apps-ipfs
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import {
  Button,
  InputAddress,
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

export default function UpFiles ({ file, endpoint, onClose, onSuccess }) {
  const theme = useThemeClass();
  const { t } = useTranslation('order');
  const { hasAccounts } = useAccounts();
  const [currentPair, setCurrentPair] = useState(() => keyring.getPairs()[0] || null);
  const [account, setAccount] = useState(null);
  const [{ isInjected }, setAccountState] = useState({ isExternal: false, isHardware: false, isInjected: false });
  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState({ isUsable: true, signer: null });
  const [signature, setSignature] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setBusy] = useState(false);
  const fileSizeError = file.size > 100 * 1024 * 1024;
  const [error, setError] = useState('');
  const errorText = fileSizeError ? t('fileSizeError') : error;
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
    setSignature('');
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
      form.append('file', file, file.name);
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
      onSuccess(upResult.data);
    } catch (e) {
      setUpState({ progress: 0, up: false });
      setBusy(false);
      console.error(e);
      setError(e.message);
    }
  };
  console.info('state->', isBusy, upState);
  return <Modal
    className={`order--accounts-Modal ${theme}`}
    header={t(`actions.upFiles`, 'Upload File')}
    size='small'
  >
    <Modal.Content>
      <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{ padding: 0 }}>{t('noAccount')}</p>}>
        <div className="flex flex-column pa3">
          <div style={{ fontWeight: 500, fontSize: '1.2rem' }}>{file.name}</div>
          <div>{filesize(file.size)}</div>
        </div>
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
              onClick={() => signAndUp()}
              isBusy={isBusy}>
        {t('action.SignAndUp', 'Sign And Upload')}
      </Button>
    </Modal.Actions>
  </Modal>;
}
