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
import { Button, Card, Columar, Dropdown, Input, InputAddress, Modal } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { createAccountsOpt } from './EthereumAccounts';

interface Props {
  className?: string;
}

function EthereumAssets ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const { data: accounts = [] } = useEtherAccounts();
  const [amount, setAmount] = useState<string>('0');
  const { provider, signer } = useEthers();
  const { contract } = useErc20Contract();
  const submitDeposit = useErc20Deposit(ethereumAddress || undefined);
  const [receiveId, setReceiveId] = useState<string | null>('' || null);
  const [transferrable, setTransferrable] = useState<boolean>(true);

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

  const approve = async () => {
    try {
      const network = ethereums[provider?.network.chainId as number];

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
        ethers.utils.parseUnits('11451419810', 18)
      );

      console.log('approveResult', approveResult);
      setTransferrable(false);
    } catch (e) {
      console.error(e);
    }
  };

  const options = useMemo(
    () => createAccountsOpt(accounts),
    [accounts]
  );

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
            <h3>{t<string>('Select the ETH address')}</h3>
            <Dropdown
              defaultValue={ethereumAddress}
              label={'eth account'}
              help={t<string>('Your Ethereum account that sent the transfer transaction')}
              onChange={setEthereumAddress}
              options={options}
              value={ethereumAddress}
            />
            <h3>{t<string>('Select the Crust address')}</h3>
            <InputAddress
              help={t<string>('The selected account to perform the derivation on.')}
              label={t<string>('account')}
              onChange={setReceiveId}
            />
            <h3>{t<string>('Type the amount')}</h3>
            <Input
              type={"number"}
              help={t<string>('The threshold of vouches that is to be reached for the account to be recovered.')}
              label={t<string>('amount')}
              onChange={setAmount}
            />
            <Button.Group>
              <Button
                icon='hand-paper'
                label={t<string>('Approve')}
                onClick={approve}
              />
              <Button
                icon='paper-plane'
                isDisabled={transferrable}
                label={t<string>('Submit')}
                onClick={submit}
              />
            </Button.Group>
          </Modal.Content>
        </Card>
      </Columar.Column>

    </Columar>
  </div>);
}

export default React.memo(EthereumAssets);
