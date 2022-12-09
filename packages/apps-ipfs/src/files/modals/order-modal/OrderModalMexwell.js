// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton, StatusContext, Toggle, Dropdown } from '@polkadot/react-components';
import { BitLengthOption } from "../../../../../react-components/src/constants"
import { DEF_FILE_NAME } from '@polkadot/apps-ipfs/market/config';

const OrderModal = ({ className = '', doAddOrder, file, onClose, t, title = 'order' }) => {
  const { hasAccounts } = useAccounts();
  const isForceFile = file ? file.isForce : false;
  const fileName = file && file.fileName ? file.fileName : DEF_FILE_NAME
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState(file ? file.originalSize.toString() : '0');
  const [price, setPrice] = useState('0 CRU');
  const [tip, setTip] = useState(0);
  const [cidNotValid, setCidNotValid] = useState(false);
  const { api, isApiReady } = useApi();
  const filePrice = useCall(isApiReady && api.query.market.filePrice) || new BN(0);
  const fileBaseFee = useCall(isApiReady && api.query.market.fileBaseFee)
  const basePrice = fileBaseFee ? fileBaseFee.toString() : 0
  const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC;
  const [priceNumber, setPriceNumber] = useState(0);
  const { queueExtrinsic } = useContext(StatusContext);

  useEffect(() => {
    const tipFee= new BN(tip.toString())
    const filePriceBN = filePrice?.mul(new BN(fileSize)).divn(1024*1024).add(new BN(basePrice));
    const priceBN = filePriceBN.add(tipFee);
    setPrice(formatBalance(priceBN, { decimals: 12, forceUnit: 'CRU' }));
    setPriceNumber(Number(filePriceBN));
  }, [fileSize, filePrice, tip, basePrice]);
  useEffect(() => {
    setCidNotValid(fileCid && !isIPFS.cid(fileCid) && !isIPFS.path(fileCid));
  }, [fileCid]);

  const [isAddPrepaid, setIsAddPrepaid] = useState(false);
  const [storeTime, setStoreTime] = useState(0);
  const [prepaid, setPrepaid] = useState(0);

  useEffect(() => {
    const storeTime = (Number(prepaid) / priceNumber / 2).toFixed(2)
    setStoreTime(storeTime) 
  }, [prepaid, priceNumber])

  const withAddPrepaid = useCallback(
    () => {
      queueExtrinsic({
        accountId: account,
        extrinsic: api.tx.market.addPrepaid(fileCid, prepaid)
      });
      doAddOrder({
        fileCid,
        fileSize,
        fileName,
      })
    },
    [api, account, queueExtrinsic, prepaid, fileCid, fileSize, fileName]
  );

  const timeOption = [{ text: "Year", value: "Year" }]

  return <Modal
    className='order--accounts-Modal'
    header={t(`actions.${title || 'order'}`, 'Order')}
    size='large'
  >
    <Modal.Content>
      <div className={className}>
        <Modal.Content>
          <Modal.Columns hint={!hasAccounts && <p className='file-info' style={{padding: 0}}>{t('noAccount')}</p>}>
            <InputAddress
              label={t('Please choose account')}
              isDisabled={!hasAccounts}
              labelExtra={
                <Available
                  label={t('transferable')}
                  params={account}
                />
              }
              defaultValue={account}
              onChange={setAccount}
              type='account'
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={cidNotValid
            ? <p className='file-info'
                 style={{ padding: 0 }}>{t('fileCidValid')}</p>
            : <p>{t('FileCidDesc')}</p>}>
            <Input
              autoFocus
              help={t('FileCidDesc')}
              label={t('File Cid')}
              onChange={setFileCID}
              isDisabled={isForceFile}
              placeholder={t('File Cid')}
              value={fileCid}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={<p>{t('fileSizeDesc')}, {Fsize(fileSize)}</p>}>
            <InputNumber
              autoFocus
              bitLength={DEFAULT_BITLENGTH}
              isError={false}
              help={t('fileSizeDesc')}
              isDisabled={title === 'speed' || title === 'renew' || isForceFile }
              label={t('fileSizeTitle')}
              onChange={setFileSize}
              value={fileSize}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('tipDesc')}>
            <InputBalance
              autoFocus
              defaultValue={tip}
              help={t('tipDesc')}
              label={t('tipTitle')}
              onChange={setTip}
              onlyCru
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('priceDesc')}>
            <Input
              help={t('priceDesc')}
              isDisabled
              label={t('File price')}
              maxLength={32}
              onChange={setPrice}
              placeholder={t('File price')}
              value={price}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns hint={t('durationDesc')}>
            <Input
              help={t('durationDesc')}
              isDisabled
              label={t('durationLabel')}
              value={6}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Content>
          <Modal.Columns>
            <Toggle
              className='typeToggle'
              label={t('LongTermStorage')}
              onChange={setIsAddPrepaid}
              value={isAddPrepaid}
            />
          </Modal.Columns>
        </Modal.Content>
        {isAddPrepaid && (
        <Modal.Content>
          <Modal.Columns>
            <p>{t('twoStepTx')}</p>
          </Modal.Columns>
          <Modal.Columns hint={t('prepaidDesc')}>
            <InputBalance
              autoFocus
              defaultValue={prepaid}
              label={t('fileGuarantee')}
              onChange={setPrepaid}
              onlyCru
            />
          </Modal.Columns>
          <Modal.Columns hint={<>{t('storeTimeDesc')}<a href='https://wiki.crust.network/docs/en/DSM#2-price-mechanism' target='_blank'>{t('learnMore')}</a></>}>
            <Input
              isDisabled
              label={t('estimateTime')}
              value={storeTime}
              onChange={setStoreTime}
            >
              <Dropdown
                defaultValue={timeOption[0].value}
                dropdownClassName='ui--SiDropdown'
                isButton
                options={timeOption}
              />
            </Input>
          </Modal.Columns>
        </Modal.Content>
        )}
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !fileSize || !account || !tip || cidNotValid || (isAddPrepaid && !Number(prepaid))}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        // onSuccess={() => {
        //   doAddOrder({
        //     fileCid,
        //     fileSize,
        //     fileName,
        //   });
        // }}
        params={
          [fileCid, fileSize, tip]
        }
        tx={api.tx.market.placeStorageOrder }
        onSuccess={isAddPrepaid ? withAddPrepaid : () => doAddOrder({
          fileCid,
          fileSize,
          fileName,
        })}
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
