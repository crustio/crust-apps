// [object Object]
// SPDX-License-Identifier: Apache-2.0
import BN from 'bn.js';
import Fsize from 'filesize';
import isIPFS from 'is-ipfs';
import React, {useEffect, useMemo, useState} from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { formatBalance } from '@polkadot/util';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '../../../../../react-components/src';
import { BitLengthOption } from '../../../../../react-components/src/constants';
function parserStrToObj (str) {
  if (!str) {
    return null
  } else {
    return JSON.parse(JSON.stringify(str))
  }
}
const OrderModal = ({ className = '', doAddOrder, file, onClose, t, title = 'order' }) => {
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState(null);
  const [fileCid, setFileCID] = useState(file ? file.cid.toString() : '');
  const [fileSize, setFileSize] = useState(file ? file.originalSize.toString() : '0');
  const [price, setPrice] = useState('0 CRU');
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

  useEffect(() => {
    // filePrice = (basePrice + byteFee * size + key_count_fee) * benefit + tips
    // benefits = 1 - min(active_funds / total_market_active_funds, 0.1)
    const tipFee= new BN(tip.toString())
    const _filePrice = filePrice?.mul(new BN(fileSize)).divn(1024*1024).add(new BN(fileKeysCountFee)).add(new BN(basePrice))
    setOriginPrice(formatBalance(_filePrice.add(tipFee), { decimals: 12, forceUnit: 'CRU' }))
    setPrice(formatBalance(_filePrice.mul(new BN(benefits)).add(tipFee), { decimals: 12, forceUnit: 'CRU' }));
  }, [fileSize, filePrice, tip, basePrice, benefits]);
  useEffect(() => {
    setCidNotValid(fileCid && !isIPFS.cid(fileCid) && !isIPFS.path(fileCid));
  }, [fileCid]);
  const benefitHint = useMemo(() => {

      return benefits &&  <span className={"file-info"}>{t("discount", {discount: 100 - benefits* 100, originPrice})}</span>
  }, [benefits, originPrice, filePrice])

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
              isDisabled={title === 'speed' || title === 'renew'}
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
              help={benefitHint}
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
      </div>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <TxButton
        accountId={account}
        icon='paper-plane'
        isDisabled={!fileCid || !fileSize || !account || !tip || cidNotValid}
        label={t('confirm')}
        onStart={() => {
          onClose();
        }}
        onSuccess={() => {
          doAddOrder({
            fileCid,
            fileSize,
          });
        }}
        params={
          [fileCid, fileSize, tip, 0]
        }
        tx={api.tx.market.placeStorageOrder }
      />
    </Modal.Actions>
  </Modal>;
};

const OrderWithBundle = connect('doAddOrder', OrderModal);

export default withTranslation('order')(OrderWithBundle);
