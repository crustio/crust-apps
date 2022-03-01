// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { ethers } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { useTranslation } from '@polkadot/apps/translate';
import { ethereums } from '@polkadot/react-api/config';
import { useErc20Contract } from '@polkadot/react-api/hoc/useErc20Contract';
import { useErc20Deposit } from '@polkadot/react-api/hoc/useErc20Deposit';
import { useEtherAccounts } from '@polkadot/react-api/useEtherAccounts';
import { useEthers } from '@polkadot/react-api/useEthers';
import { Available, Button, Card, Columar, Dropdown, Input, InputAddress, Modal } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { createAccountsOpt } from './EthereumAccounts';
import ethereumLogo from '../images/Ethereum_logo_2014.svg';
import logoCrust from '../images/crust.svg';
import { useApi } from '@polkadot/react-hooks';
import { useAllowanceQuery } from '@polkadot/react-api/hoc/useAllowanceQuery';
import styled from 'styled-components';

interface Props {
  className?: string;
}

function EthereumAssets ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const { data: accounts = [] } = useEtherAccounts();
  const [amount, setAmount] = useState<string>('0');
  const [isAmountError, setIsAmountError] = useState<boolean>(true);
  const { provider, signer } = useEthers();
  const { contract } = useErc20Contract();
  const submitDeposit = useErc20Deposit(ethereumAddress || undefined);
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const { systemChain: substrateName } = useApi();
  const isMaxwell = substrateName === 'Crust Maxwell';
  const { allowance } = useAllowanceQuery(ethereumAddress || undefined);
  const bridgeTxStatusLink = isMaxwell ? 'https://etherscan.io/address/0x9d332427e6d1b91d9cf8d2fa3b41df2012887aab' : 'https://etherscan.io/address/0x18FCb27e4712AC11B8BecE851DAF96ba8ba34720'
  const [ shouldApprove, setShouldApprove ] = useState<boolean>(false);

  console.log('encodeURIComponent(`${window.location.origin}/#/files`', encodeURIComponent(
    `${window.location.origin}/#/bridge/bridgeToElrond`
  ))

  useEffect(() => {
    if (Number(amount) <= 0) {
      setIsAmountError(true)
    } else {
      setIsAmountError(false)
    }

  }, [amount])

  useEffect(() => {
    if (allowance && allowance >= Number(amount)) {
      setShouldApprove(false)
    } else {
      setShouldApprove(true)
    }
  }, [allowance, amount])

  if (window && !window?.web3?.currentProvider?.isMetaMask) {
    return (<main>
      <Columar>
        <Columar.Column>
          <Card withBottomMargin>
            <Banner type='warning'>
              <p>{t<string>('No metamask extension found, please install it first.')}&nbsp;<a
                href='https://metamask.io/download.html'
                rel='noopener noreferrer'
                target='_blank'
              >{t<string>('Install now...')}</a></p>
            </Banner>
          </Card>
        </Columar.Column>
      </Columar>
    </main>);
  }

  const submit = async () => {
    const recipient = u8aToHex(decodeAddress(receiveId || ''));

    try {
      const erc20Amount = ethers.utils.parseUnits(
        amount?.toString() || '0',
        18
      );
      const response = await submitDeposit?.(erc20Amount, recipient);
      console.log('response', response);
    } catch (error) {
      console.error(error);
    }
  };

  const approvePermanent = async () => {
    try {
      const network = ethereums[substrateName][provider?.network.chainId as number];

      if (
        contract === undefined ||
            network === undefined ||
            signer === undefined
      ) {
        return;
      }

      const contractSigned = contract.connect(signer);

      const approveResult = await contractSigned.functions.approve?.(
        network.erc20AssetHandler,
        ethers.utils.parseUnits('20000000', 18)
      );

      console.log('approveResult', approveResult);
    } catch (e) {
      console.error(e);
    }
  };

  const approveOnce = async () => {
    try {
      const network = ethereums[substrateName][provider?.network.chainId as number];

      if (
        contract === undefined ||
            network === undefined ||
            signer === undefined
      ) {
        return;
      }

      const contractSigned = contract.connect(signer);

      const approveResult = await contractSigned.functions.approve?.(
        network.erc20AssetHandler,
        ethers.utils.parseUnits(amount?.toString() || '0', 18)
      );

      console.log('approveResult', approveResult);
    } catch (e) {
      console.error(e);
    }
  };

  const options = useMemo(
    () => createAccountsOpt(accounts),
    [accounts]
  );

  const unitOption = [{ text: "CRU", value: "CRU" }]

  useEffect(() => {
    if (accounts.length) {
      setEthereumAddress(accounts[0]);
    }
  }, [accounts]);

  return (<div className={className}>
    <Columar>
      <Columar.Column>
        <Card withBottomMargin>
          <Modal.Content>
            <Banner type='warning'>
              <p>{t<string>('This function is an internal test stage, the assets will not be lost, but there may be a delay (max to 48 hours) in the arrival of the account.')}</p>
            </Banner>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('From Ethereum')}</span></h3>
            <div style={{display: "flex", alignItems: 'center'}}>
                <img style={{ "width": "64px", height: '64px', padding: '3px', 'verticalAlign': 'middle' }} src={ethereumLogo as string} />
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <Dropdown
                        defaultValue={ethereumAddress}
                        label={t<string>('Ethereum address')}
                        help={t<string>('Your Ethereum account that sent the transfer transaction')}
                        onChange={setEthereumAddress}
                        options={options}
                        value={ethereumAddress}
                    />
                </div>
            </div>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('To Crust')}</span></h3>
            <div style={{display: "flex"}}>
                <img style={{ "width": "64px", "height": "64px", padding: '1px', 'verticalAlign': 'middle' }} src={logoCrust as string} />
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <InputAddress
                        help={t<string>('The selected account is used to receive tokens')}
                        label={t<string>('account')}
                        onChange={setReceiveId}
                        labelExtra={
                          <Available
                            label={t('transferrable')}
                            params={receiveId}
                          />
                        }
                    />
                </div>
            </div>
            <h3><span style={{ 'fontWeight': 'bold' }}>{t<string>('Amount')}</span></h3>
            <div style={{display: "flex", alignItems: 'center'}}>
                <div style={{ "width": "64px", 'verticalAlign': 'middle' }}/>
                <div style={{ flex: 1, 'verticalAlign': 'middle' }}>
                    <Input
                        type={"number"}
                        help={t<string>('Type the amount you want to transfer.')}
                        label={t<string>('amount')}
                        isError={isAmountError}
                        onChange={setAmount}
                        defaultValue={'0'}
                        min={0}
                    >
                        <Dropdown
                            defaultValue={unitOption[0].value}
                            dropdownClassName='ui--SiDropdown'
                            isButton
                            options={unitOption}
                        />
                    </Input>
                </div>
            </div>

            
            <Button.Group>
              {shouldApprove && (
                <>
                  <Button
                    icon='hand-paper'
                    isDisabled={isAmountError}
                    label={t<string>('Approve Permanent')}
                    onClick={approvePermanent}
                  />
                  <Button
                    icon='hand-paper'
                    isDisabled={isAmountError}
                    label={t<string>('Approve Once')}
                    onClick={approveOnce}
                  /> 
                </>
              )}
              <Button
                icon='paper-plane'
                isDisabled={isAmountError || shouldApprove}
                label={t<string>('Submit')}
                onClick={submit}
              />
            </Button.Group>
              
          </Modal.Content>
        </Card>
      </Columar.Column>
      <Columar.Column>
        <Card>
          <Banner type="warning">
            <p>{t<string>('Cross-chain transfers are automatically executed by smart contracts. after the execution of the contract is completed, the funds will arrive in the account. Please wait patiently.')}&nbsp;<a target="_blank" href={bridgeTxStatusLink}>{t<string>('You can check the transaction status here...')}</a></p>
          </Banner>
        </Card>
      </Columar.Column>
    </Columar>
  </div>);
}

export default React.memo(styled(EthereumAssets)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
