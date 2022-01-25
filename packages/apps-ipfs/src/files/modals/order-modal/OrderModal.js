// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, {useEffect, useMemo, useState, useCallback, useContext} from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton, Toggle, StatusContext, Dropdown } from '@polkadot/react-components';
import { BitLengthOption } from '../../../../../react-components/src/constants';
import { DEF_FILE_NAME } from '@polkadot/apps-ipfs/market/config';
function parserStrToObj (str) {
  if (!str) {
    return null
  } else {
    return JSON.parse(JSON.stringify(str))
  }
}


function formatBn(bn, round = 12, unit = 'CRU' ) {
  const decimals = formatBalance.getDefaults().decimals
  const createZero = (count) => {
    let zeroText = ''
    for (let i = 0; i < count; i++) {
      zeroText += '0'
    }
    return zeroText;
  }
  const text = bn.toString()
  const intPartMoreZero = text.length > decimals
  const intPart = intPartMoreZero ? text.substr(0, text.length - decimals) : '0'
  let decimalPart = intPartMoreZero ? text.substr(text.length - decimals) :
    `${createZero(decimals - text.length)}${text}`
  // while (decimalPart.endsWith('0')) {
  //   decimalPart = decimalPart.substr(0, decimalPart.length - 1)
  // }
  // if (decimalPart === '') decimalPart = '0'
  // if (decimalPart )
  if (decimalPart.length > round) {
    decimalPart = decimalPart.substr(0, round)
  }
  return `${intPart}.${decimalPart} ${unit}`
}
const OrderModal = ({ className = '', doAddOrder, file, onClose, t, title = 'order' }) => {
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const isForceFile = file ? file.isForce : false;
  const fileName = file && file.fileName ? file.fileName : DEF_FILE_NAME
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState(file ? file.originalSize.toString() : '0');
  const [price, setPrice] = useState('0 CRU');
  const [priceNumber, setPriceNumber] = useState(0);
  const [originPrice, setOriginPrice] = useState('0 CRU');
  const [tip, setTip] = useState(0);
  const [cidNotValid, setCidNotValid] = useState(false);
  const { api, isApiReady } = useApi();
  const filePrice = useCall(isApiReady && api.query.market.fileByteFee) || new BN(0);
  const fileBaseFee = useCall(isApiReady && api.query.market.fileBaseFee)
  const fileKeysCountFee = useCall(isApiReady && api.query.market.fileKeysCountFee)
  const basePrice = fileBaseFee ? fileBaseFee.toString() : 0
  const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC;
  const currentBenefits = useCall(isApiReady && api.query.benefits.currentBenefits)
  const marketBenefits = useCall(isApiReady && api.query.benefits.marketBenefits, [account])
  const benefits = useMemo(() => {
    const total_market_active_funds = currentBenefits ? parserStrToObj(currentBenefits).total_market_active_funds : 0
    const active_funds = marketBenefits ? parserStrToObj(marketBenefits).active_funds : 0
    return (1 - Math.min( active_funds / (total_market_active_funds || 1), 0.1))
  }, [currentBenefits, marketBenefits])
  const { queueExtrinsic } = useContext(StatusContext);

  useEffect(() => {
    // filePrice = (basePrice + byteFee * size + key_count_fee) * benefit + tips
    // benefits = 1 - min(active_funds / total_market_active_funds, 0.1)
    const tipFee= new BN(tip.toString())
    const _filePrice = filePrice?.mul(new BN(fileSize)).divn(1024*1024).add(new BN(fileKeysCountFee)).add(new BN(basePrice))
    const priceBN = _filePrice.mul(new BN(benefits)).add(tipFee)
    setOriginPrice(formatBn(_filePrice.add(tipFee)))
    setPrice(formatBn(priceBN));
    setPriceNumber(Number(priceBN));
  }, [fileSize, filePrice, tip, basePrice, benefits]);
  useEffect(() => {
    setCidNotValid(fileCid && !isIPFS.cid(fileCid) && !isIPFS.path(fileCid));
  }, [fileCid]);
  const benefitHint = useMemo(() => {
      return benefits < 1 &&  <span className={"file-info"}>{100 - benefits* 100 + t("discount") + originPrice}</span>
  }, [benefits, originPrice, filePrice])

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
                  label={t('transferrable')}
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
              isDisabled={isForceFile}
              onChange={setFileCID}
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
          <Modal.Columns hint={<p>{t('priceDesc')} {benefitHint}</p>}>
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
              label={t('Long term storage')}
              onChange={setIsAddPrepaid}
              value={isAddPrepaid}
            />
          </Modal.Columns>
        </Modal.Content>
        {isAddPrepaid && (
        <Modal.Content>
          <Modal.Columns>
            <p>{t('The storage will be completed through two transactions')}</p>
          </Modal.Columns>
          <Modal.Columns hint={t('prepaidDesc')}>
            <InputBalance
              autoFocus
              defaultValue={prepaid}
              label={t('Gurantee fee for the file storage')}
              onChange={setPrepaid}
              onlyCru
            />
          </Modal.Columns>
          <Modal.Columns hint={t('storeTimeDesc')}>
            <Input
              isDisabled
              label={t('Estimate validity period ')}
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
          [fileCid, fileSize, tip, 0]
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
