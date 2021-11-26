// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Address, SignableMessage } from '@elrondnetwork/erdjs';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import store from 'store';

import { FlowM } from '@polkadot/app-files/flow/types';
import { useFlow } from '@polkadot/app-files/flow/useFlow';
import { Metamask } from '@polkadot/app-files/metamask/types';
import useMetamask from '@polkadot/app-files/metamask/useMetamask';
import { NearM } from '@polkadot/app-files/near/types';
import { useNear } from '@polkadot/app-files/near/useNear';
import { SolanaM } from '@polkadot/app-files/solana/types';
import { useSolana } from '@polkadot/app-files/solana/useSolana';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useAccounts } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { isFunction, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';

import { ElrondM } from './elrond/types';
import { useElrond } from './elrond/useElrond';
import { SaveFile } from './types';

// eslint-disable-next-line
const fcl = require('@onflow/fcl');

export interface Files {
  files: SaveFile[],
  isLoad: boolean,
}

type KEYS_FILES = 'files' | 'pins:files'

export interface WrapFiles extends Files {
  setFiles: (files: SaveFile[]) => void,
  key: KEYS_FILES,
}

export interface UseSign {
  isLocked: boolean
  sign?: (data: string, password?: string) => Promise<string>
}

type KEYS = 'files:login' | 'pins:login'

export class LoginUser {
  account = '';
  pubKey?: string;
  wallet: '' | 'metamask' | 'near' | 'flow' | 'elrond' | 'solana' = '';
  key?: KEYS = 'files:login';
}

export interface WrapLoginUser extends LoginUser {
  isLoad: boolean
  setLoginUser: (u: LoginUser) => void
  logout: () => void
  sign?: (data: string, password?: string) => Promise<string>
  isLocked: boolean
  metamask: Metamask,
  near: NearM,
  flow: FlowM,
  solana: SolanaM,
  elrond: ElrondM
}

const defFilesObj: Files = { files: [], isLoad: true };

export function useFiles (key: KEYS_FILES = 'files'): WrapFiles {
  const [filesObj, setFilesObj] = useState<Files>(defFilesObj);

  useEffect(() => {
    try {
      const f = store.get(key, defFilesObj) as Files;

      f.isLoad = false;

      if (f !== defFilesObj) {
        setFilesObj(f);
      }
    } catch (e) {
      console.error(e);
    }
  }, [key]);
  const setFiles = useCallback((nFiles: SaveFile[]) => {
    const nFilesObj = { ...filesObj, files: nFiles };

    setFilesObj(nFilesObj);
    store.set(key, nFilesObj);
  }, [filesObj, key]);

  return useMemo(() => ({ ...filesObj, setFiles, key }), [filesObj, setFiles, key]);
}

export function useSign (account: LoginUser, metamask: Metamask, near: NearM, flow: FlowM, solana: SolanaM, elrond: ElrondM): UseSign {
  const [state, setState] = useState<UseSign>({ isLocked: true });

  useEffect(() => {
    if (!account.account) return;

    // eslint-disable-next-line
    const nearKeyPair = near?.keyPair;

    if (account.wallet === 'near' && near.wallet && nearKeyPair) {
      setState((o) => ({ ...o, isLocked: false }));

      const sign = function (data: string): Promise<string> {
        const msg = Buffer.from(data);
        // eslint-disable-next-line
        const { signature } = nearKeyPair.sign(msg);
        const hexSignature = Buffer.from(signature).toString('hex');

        return Promise.resolve<string>(hexSignature);
      };

      setState((o) => ({ ...o, sign }));

      return;
    }

    if (account.wallet === 'flow') {
      setState((o) => ({ ...o, isLocked: false }));

      const sign = function (data: string): Promise<string> {
        const msg = Buffer.from(data);

        // eslint-disable-next-line
        return fcl.currentUser().signUserMessage(msg.toString('hex'))
          .then((res: any) => {
            if (!res) {
              throw new Error('Signature failed');
            }

            if (_.includes(res, 'Declined: User rejected signature')) {
              throw new Error('User rejected signature');
            }

            return window.btoa(JSON.stringify(res));
          });
      };

      setState((o) => ({ ...o, sign }));

      return;
    }

    if (account.wallet === 'solana') {
      setState((o) => ({ ...o, isLocked: false }));

      const sign = function (data: string): Promise<string> {
        const encodedMessage = new TextEncoder().encode(data);
        // eslint-disable-next-line
        return window.solana.signMessage(encodedMessage, 'utf8')
          // eslint-disable-next-line
          .then((sig: any) => Buffer.from(sig.signature).toString('hex'));
      };

      setState((o) => ({ ...o, sign }));

      return;
    }

    if (account.wallet === 'elrond') {
      // waiting for sign
      const provider = elrond.provider;

      if (elrond.isInstalled && provider) {
        const sign = function (data: string): Promise<string> {
          const address = provider.account.address;
          const signableMessage = new SignableMessage({
            address: new Address(address),
            message: Buffer.from('0x' + Buffer.from(address).toString('hex'), 'ascii')
          });

          return provider.signMessage(signableMessage).then((message) => {
            return `elrond-${address}-${signableMessage.serializeForSigning().toString('hex')}:${message.signature.hex()}`;
          })
            .catch((err) => {
              console.error('Elrond wallet signMessage error', err);

              return '';
            });
        };

        setState((o) => ({ ...o, sign, isLocked: false }));
      }

      return;
    }

    if (account.wallet === 'metamask') {
      setState((o) => ({ ...o, isLocked: false }));
      const ethReq = metamask?.ethereum?.request;

      if (metamask.isInstalled && metamask.isAllowed && ethReq) {
        const sign = function (data: string): Promise<string> {
          const msg = Buffer.from(data, 'utf8').toString('hex');
          // const msg = data;

          console.info('msg::', msg);

          return ethReq<string>({
            from: account.account,
            params: [msg, account.account],
            method: 'personal_sign'
          }).then((signature) => {
            console.info('signData:', signature);

            // return ethReq<string>({
            //   from: account.account,
            //   params: [msg, signature],
            //   method: 'personal_ecRecover'
            // }).then((res) => {
            //   console.info('recover:', res);
            //
            //   return signature;
            // });
            return signature;
          });
        };

        setState((o) => ({ ...o, sign }));
      }
    } else {
      const currentPair = keyring.getPair(account.account);

      if (!currentPair) return;
      const meta = currentPair.meta || {};
      const isInjected = (meta.isInjected as boolean) || false;
      const accountIsLocked = isInjected ? false : currentPair.isLocked || false;

      setState((o) => ({ ...o, isLocked: accountIsLocked }));

      // for injected, retrieve the signer
      if (meta.source && isInjected) {
        web3FromSource(meta.source as string)
          .catch(() => null)
          .then((injected) => {
            const signRaw = injected?.signer?.signRaw;

            if (signRaw && isFunction(signRaw)) {
              const sign = function (data: string): Promise<string> {
                return signRaw({
                  address: currentPair.address,
                  data: stringToHex(data),
                  type: 'bytes'
                }).then((res) => res.signature);
              };

              setState((o) => ({ ...o, sign }));
            }

            return null;
          })
          .catch(console.error);
      } else {
        const sign = function (data: string, password?: string): Promise<string> {
          return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
              try {
                if (accountIsLocked) {
                  currentPair.unlock(password);
                }

                resolve(u8aToHex(currentPair.sign(stringToU8a(data))));
              } catch (e) {
                reject(e);
              }
            }, 100);
          });
        };

        setState((o) => ({ ...o, sign }));
      }
    }
  }, [account, metamask, near, flow, solana, elrond]);

  return state;
}

const defLoginUser: LoginUser = { account: '', wallet: '', key: 'files:login' };

export function useLoginUser (key: KEYS = 'files:login'): WrapLoginUser {
  const [account, setAccount] = useState<LoginUser>(defLoginUser);
  const [isLoad, setIsLoad] = useState(true);
  const accounts = useAccounts();
  const metamask = useMetamask();
  const near = useNear();
  const flow = useFlow();
  const solana = useSolana();
  const elrond = useElrond();
  const accountsIsLoad = accounts.isLoad;
  const isLoadUser = isLoad || accountsIsLoad || metamask.isLoad || near.isLoad || flow.isLoad || solana.isLoad;

  useEffect(() => {
    try {
      const f = store.get(key, defLoginUser) as LoginUser;

      if (accounts.isLoad || near.isLoad || flow.isLoad || solana.isLoad || elrond.isLoad) return;

      // eslint-disable-next-line
      const nearWallet = near.wallet;
      // eslint-disable-next-line
      const nearKeyPair = near.keyPair;

      console.info('neer::', near);

      // eslint-disable-next-line
      if (nearWallet && nearWallet.isSignedIn() && nearKeyPair) {
        // eslint-disable-next-line
        const account = nearWallet.getAccountId() as string;

        setAccount({
          account,
          key,
          wallet: 'near',
          // eslint-disable-next-line
          pubKey: nearKeyPair.getPublicKey().toString().substr(8)
        });
      }

      const provider = elrond.provider;

      if (provider) {
        provider.getAddress().then((account) => {
          if (account === f.account) {
            setAccount(f);
          }
        }).catch(console.error);
      }

      if (f !== defLoginUser) {
        if (f.account && accounts.isAccount(f.account)) {
          setAccount(f);
        }

        if (f.account && f.wallet === 'metamask') {
          if (metamask.isLoad) return;

          if (metamask.isAllowed && metamask.accounts.includes(f.account)) {
            setAccount(f);
          }
        }
      }

      setIsLoad(false);
    } catch (e) {
      setIsLoad(false);
      console.error(e);
    }
  }, [accounts, metamask, near, flow, solana, key, elrond]);

  const setLoginUser = useCallback((loginUser: LoginUser) => {
    const nAccount = { ...loginUser, key };

    setAccount((old) => {
      if (old.wallet === 'near') {
        // eslint-disable-next-line
        near.wallet?.signOut();
      }

      return nAccount;
    });
    store.set(key, nAccount);
  }, [near, key]);

  const logout = useCallback(async () => {
    if (account.wallet === 'flow') {
      // eslint-disable-next-line
      const flowUser = await fcl.currentUser().snapshot();

      // eslint-disable-next-line
      if (flowUser.loggedIn) {
        // eslint-disable-next-line
        await fcl.unauthenticate();
      }
    } else if (account.wallet === 'solana') {
      console.log('logout', window.solana);

      // eslint-disable-next-line
      if (window.solana && window.solana.isConnected) {
        // eslint-disable-next-line
        window.solana.disconnect();
        // eslint-disable-next-line
        window.solana.on('disconnect', () => { console.log('Solana disconnected'); });
      }
    }

    setLoginUser({ ...defLoginUser });
  }, [setLoginUser, account]);
  const uSign = useSign(account, metamask, near, flow, solana, elrond);

  return useMemo(() => {
    const wrapLoginUser: WrapLoginUser = {
      ...account,
      key,
      isLoad: isLoadUser,
      setLoginUser,
      logout,
      metamask,
      near,
      flow,
      solana,
      elrond,
      ...uSign
    };

    if (window.location.hostname === 'localhost') {
      // eslint-disable-next-line
      // @ts-ignore
      window.wrapLU = wrapLoginUser;
    }

    return wrapLoginUser;
  }, [account, isLoadUser, setLoginUser, logout, uSign, metamask, near, flow, solana, key, elrond]);
}

export const getPerfix = (user: LoginUser): string => {
  if (user.wallet === 'metamask') {
    return 'eth';
  }

  if (user.wallet === 'near') {
    return 'near';
  }

  if (user.wallet === 'flow') {
    return 'flow';
  }

  if (user.wallet === 'solana') {
    return 'sol';
  }

  if (user.wallet === 'elrond') {
    return 'elrond';
  }

  return 'substrate';
};
