// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

import { WrapLoginUser } from '@polkadot/app-files/hooks';
import { nearConfig } from '@polkadot/app-files/near/config';
import { externalLogos } from '@polkadot/apps-config';
import { InputAddress, StatusContext } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { Button } from './btns';
import { useTranslation } from './translate';

// eslint-disable-next-line
const fcl = require('@onflow/fcl');

export interface Props {
  className?: string
  user: WrapLoginUser,
}

function Login ({ className, user }: Props) {
  const { t } = useTranslation();
  const [showCrust, setShowCrust] = useState(false);
  const _onToggleWalletCrust = useCallback(() => setShowCrust(!showCrust), [showCrust]);
  const { hasAccounts } = useAccounts();
  const [account, setAccount] = useState('');
  const onAccountChange = useCallback((nAccount: string | null) => {
    if (nAccount) {
      setAccount(nAccount);
    }
  }, []);
  const onClickNext = useCallback(() => {
    if (!account) return;
    user.setLoginUser({ account, wallet: '' });
  }, [account, user]);

  const { queueAction } = useContext(StatusContext);
  const _onClickMetamask = useCallback(() => {
    const ethReq = user.metamask.ethereum?.request;

    if (user.metamask.isInstalled && ethReq) {
      ethReq<string[]>({
        method: 'eth_requestAccounts'
      })
        .then((res) => {
          console.info('accounts:', res);
          const selectedAddress = user.metamask.ethereum?.selectedAddress;

          if (selectedAddress && res.includes(selectedAddress)) {
            user.setLoginUser({
              account: selectedAddress,
              wallet: 'metamask'
            });
          } else if (res.length) {
            user.setLoginUser({
              account: res[0],
              wallet: 'metamask'
            });
          }
        })
        .catch((error) => {
          console.error('accountsError:', error);
        });
    } else {
      queueAction({
        status: 'error',
        message: t('Need install MetaMask'),
        action: t('Connect Metamask')
      });
    }
  }, [user, queueAction, t]);

  const _onClickNear = useCallback(() => {
    if (!user.near.wallet) {
      queueAction({
        status: 'error',
        message: t('Not Create NearConnetion'),
        action: t('Connet Near')
      });

      return;
    }

    // eslint-disable-next-line
    user.near.wallet.requestSignIn(nearConfig.contractName, 'Crust Files');
  }, [user, queueAction, t]);

  const _onClickFlow = useCallback(async () => {
    // eslint-disable-next-line
    let flowUser = await fcl.currentUser().snapshot();

    // eslint-disable-next-line
    if (!flowUser.loggedIn) {
      // eslint-disable-next-line
      await fcl.authenticate();
    }

    // eslint-disable-next-line
    flowUser = await fcl.currentUser().snapshot();
    user.setLoginUser({
      // eslint-disable-next-line
      account: flowUser.addr,
      wallet: 'flow'
    });
  }, [user]);

  const _onClickSolana = useCallback(() => {
    if (!user.solana.isInstalled) {
      queueAction({
        status: 'error',
        message: t('Need install Phantom'),
        action: t('Connect Phantom')
      });

      return;
    }

    // eslint-disable-next-line
    if (window.solana.isConnected) {
      user.setLoginUser({
        // eslint-disable-next-line
        account: window.solana.publicKey.toBase58(),
        wallet: 'solana'
      });

      return;
    }

    // eslint-disable-next-line
    window.solana.connect();
    // eslint-disable-next-line
    window.solana.on('connect', () => {
      user.setLoginUser({
        // eslint-disable-next-line
        account: window.solana.publicKey.toBase58(),
        wallet: 'solana'
      });
    });
  }, [user, queueAction, t]);

  return (
    <div className={className}>
      <div className='loginPanel'>
        <div className='space1'/>
        {
          user.key === 'files:login' &&
          <div className='loginSpec'>
            <div className='leftPanel'>
              <div className='specTitle'>{t('Crust Files')}</div>
              <div
                className='specSubTitle'
                dangerouslySetInnerHTML={{ __html: t('Enjoy storing your files in a <span>Web3</span> style. Now free.') }}>
              </div>
              <div className='specItem'>{`- ${t('Multi-wallet access')}`}</div>
              <div className='specItem'>{`- ${t('Easily share links to friends')}`}</div>
              <div className='specItem'>{`- ${t('Long-term storage with abundant IPFS replicas')}`}</div>
              <div className='specItem'>{`- ${t('Retrieve your files anywhere, anytime')}`}</div>
              <div
                className='specSubTitle2'>{`${t('Crust Files is open source and welcome to contribute! Following features are coming soon:')}`}</div>
              <div className='specItem'>{`- ${t('End-to-end file encryption')}`}</div>
              <div className='specItem'>{`- ${t('Paid service with smart contract on Polygon, Ethereum, Near, Flow and Solana')}`}</div>
            </div>
            <img
              className='specIcon'
              src={externalLogos.crustFilesBox as string}
            />
          </div>
        }
        {
          user.key === 'pins:login' &&
          <div className='loginSpec'>
            <div className='leftPanel'>
              <div className='specTitle'>{t('Crust Pins')}</div>
              <div className='specSubTitle'>{t('Decentralized IPFS Pin by Crust\nFor any given CID\nWith just one click.')}</div>
            </div>
            <img
              className='specIcon'
              src={externalLogos.crustPinsPin as string}
            />
          </div>
        }
        <div className='signWithWallet'>
          {
            !showCrust &&
            <>
              <div className='signTitle'>{t('Sign-in with a Web3 wallet')}</div>
              <div className='wallets'>
                <img
                  className='walletIcon'
                  onClick={_onToggleWalletCrust}
                  src={externalLogos.walletCrust as string}
                />
                <img
                  className='walletIcon'
                  onClick={_onClickMetamask}
                  src={externalLogos.walletMetamask as string}
                />
                <img
                  className='walletIcon'
                  onClick={_onClickNear}
                  src={externalLogos.walletNear as string}
                />
                <img
                  className='walletIcon'
                  onClick={_onClickFlow}
                  src={externalLogos.walletFlow as string}
                />
                <img
                  className='walletIcon'
                  onClick={_onClickSolana}
                  src={externalLogos.walletSolana as string}
                />
              </div>
            </>
          }
          {
            showCrust &&
            <>
              <InputAddress
                className={'inputAddress'}
                defaultValue={account}
                isDisabled={!hasAccounts}
                label={t<string>(hasAccounts ? 'Please choose account' : 'Need to connect a plug-in wallet or import an account first')}
                onChange={onAccountChange}
                type='account'
              />
              <div className='btns'>
                <Button
                  flex={1}
                  label={t('Continue with my account')}
                  onClick={onClickNext}/>
                <div className='btn-space'/>
                <Button
                  flex={1}
                  is2={true}
                  label={t('Cancel')}
                  onClick={_onToggleWalletCrust}
                />
              </div>
            </>
          }
        </div>
        <div className='space2'/>
      </div>
    </div>
  );
}

export default React.memo<Props>(styled(Login)`
  padding: 2rem;

  .loginPanel {
    height: 90vh;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .space1 {
      flex: 2;
    }

    .space2 {
      flex: 3;
    }
  }

  .loginSpec {
    display: flex;
    align-items: center;

    .leftPanel {
      display: flex;
      max-width: 580px;
      flex-direction: column;
    }

    .specTitle {
      font-size: 32px;
      font-weight: 600;
      color: #2E333B;
      line-height: 45px;
      margin-bottom: 1.6rem;
    }

    .specSubTitle {
      font-size: 24px;
      font-weight: 400;
      color: #666666;
      line-height: 33px;
      margin-bottom: 0.6rem;
      white-space: break-spaces;

      span {
        color: #FF8D00;
      }
    }

    .specSubTitle2 {
      font-size: 24px;
      font-weight: 400;
      color: #666666;
      line-height: 33px;
      margin-top: 1.6rem;
      margin-bottom: 0.6rem;
    }

    .specItem {
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }

    .specIcon {
      object-fit: contain;
      width: 290px;
      height: 232px;
      margin-left: 10px;
    }
  }

  .signWithWallet {
    height: 182px;
    margin-top: 2rem;
    min-width: 740px;
    background: #F4F4F4;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .signTitle {
      font-size: 20px;
      font-weight: 600;
      color: #2E333B;
      line-height: 28px;
    }

    .wallets {
      margin-top: 1rem;
      display: flex;
    }

    .walletIcon {
      cursor: pointer;
      width: 128px;
      height: 110px;
      object-fit: contain;
    }

    .inputAddress {
      width: 100%;
    }

    .btns {
      margin-top: 1rem;
      display: flex;
      width: 100%;

      .btn-space {
        width: 15px;
        flex-shrink: 0;
      }
    }

  }
`);
