// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import filesize from 'filesize';
import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

import { getPerfix, useFiles, WrapLoginUser } from '@polkadot/app-files/hooks';
import { useAuthPinner } from '@polkadot/app-files/useAuth';
import { Badge, CopyButton, Dropdown, Password, StatusContext, Table } from '@polkadot/react-components';
import { QueueProps } from '@polkadot/react-components/Status/types';

import { Button } from './btns';
import { useTranslation } from './translate';
import { SaveFile } from './types';

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

type OnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => void

function CrustPinner ({ className, user }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext<QueueProps>(StatusContext);
  const [isBusy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [CID, setCID] = useState('');
  const [isValidCID, setValidCID] = useState(false);
  const onChangeCID = useCallback<OnInputChange>((e) => {
    const cid = (e.target.value ?? '').trim();

    setValidCID(cid.startsWith('Qm') && cid.length === 46);
    setCID(e.target.value);
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
      const perSignData = `${prefix}-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const AuthBearer = `Bearer ${base64Signature}`;

      await axios.request({
        data: {
          cid: CID
        },
        headers: { Authorization: AuthBearer },
        method: 'POST',
        url: `${pinner.value}/psa/pins`
      });
      const filter = wFiles.files.filter((item) => item.Hash !== CID);

      wFiles.setFiles([{
        Hash: CID,
        Name: '',
        Size: '',
        UpEndpoint: '',
        PinEndpoint: pinner.value
      }, ...filter]);
      setCID('');
      setBusy(false);
    } catch (e) {
      setBusy(false);
      queueAction({
        status: 'error',
        message: t('Error'),
        action: t('Pin')
      });
    }
  }, [isValidCID, pinner, CID, queueAction, user, password, wFiles, t]);

  return <main className={className}>
    <header>
      <div className='inputPanel'>
        <input
          className={'inputCID'}
          onChange={onChangeCID}
          placeholder={t('Enter CID')}
          value={CID}
        />
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
            label={t<string>('password')}
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
          >{filesize(Number(f.Size), { round: 2 })}</td>
          <td
            className='end'
            colSpan={1}
          >
            <a
              href={`${window.location.origin}/?rpc=wss%3A%2F%2Frpc.crust.network#/storage_files/status/${f.Hash}`}
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
    margin: 1.5rem;

    .inputCID {
      flex: 2;
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
`);
