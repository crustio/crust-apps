// Copyright 2017-2021 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { KeyringInstance } from '@polkadot/keyring/types';
import type { ApiProps } from '@polkadot/react-api/types';
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Log, LogType, Snippet } from './types';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Dropdown, Editor, Tabs } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import * as types from '@polkadot/types';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import makeWrapper from './snippets/wrapping';
import ActionButtons from './ActionButtons';
import { CUSTOM_LABEL, STORE_EXAMPLES, STORE_SELECTED } from './constants';
import Output from './Output';
import allSnippets from './snippets';
import { useTranslation } from './translate';

interface Injected {
  api: ApiPromise;
  console: {
    error: (...args: any[]) => void;
    log: (...args: any[]) => void;
  };
  hashing: typeof hashing;
  keyring: KeyringInstance | null;
  setIsRunning: (isRunning: boolean) => void;
  types: typeof types;
  util: typeof util;
  [name: string]: any;
}

const ALLOWED_GLOBALS = ['atob', 'btoa'];
const DEFAULT_NULL = { Atomics: null, Bluetooth: null, Clipboard: null, Document: null, Function: null, Location: null, ServiceWorker: null, SharedWorker: null, USB: null, global: null, window: null };

const snippets = JSON.parse(JSON.stringify(allSnippets)) as Snippet[];
let hasSnippetWrappers = false;
const archiveParams = '{Atomics,Bluetooth,Chart,Clipboard,Color,Document,FCL_REGISTRY,FontAwesomeConfig,Function,Location,Prism,ServiceWorker,SharedWorker,USB,_,___FONT_AWESOME___,__ledgerLogsListen,__polkadotjs,__react_router_build__,_babelPolyfill,alert,api,blur,caches,cancelAnimationFrame,cancelIdleCallback,captureEvents,chrome,clearImmediate,clearInterval,clearTimeout,clientInformation,close,closed,confirm,console,cookieStore,core,createImageBitmap,crossOriginIsolated,crypto,customElements,defaultStatus,defaultstatus,define,devicePixelRatio,document,elrondWallet,ethereum,event,external,fetch,find,focus,frameElement,frames,getComputedStyle,getSelection,global,hashing,history,indexedDB,injectedWeb3,innerHeight,innerWidth,isSecureContext,keyring,length,localStorage,location,locationbar,matchMedia,menubar,moveBy,moveTo,name,navigator,onabort,onafterprint,onanimationend,onanimationiteration,onanimationstart,onappinstalled,onauxclick,onbeforeinstallprompt,onbeforeprint,onbeforeunload,onbeforexrselect,onblur,oncancel,oncanplay,oncanplaythrough,onchange,onclick,onclose,oncontextmenu,oncuechange,ondblclick,ondevicemotion,ondeviceorientation,ondeviceorientationabsolute,ondrag,ondragend,ondragenter,ondragleave,ondragover,ondragstart,ondrop,ondurationchange,onemptied,onended,onerror,onfocus,onformdata,ongotpointercapture,onhashchange,oninput,oninvalid,onkeydown,onkeypress,onkeyup,onlanguagechange,onload,onloadeddata,onloadedmetadata,onloadstart,onlostpointercapture,onmessage,onmessageerror,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup,onmousewheel,onoffline,ononline,onpagehide,onpageshow,onpause,onplay,onplaying,onpointercancel,onpointerdown,onpointerenter,onpointerleave,onpointermove,onpointerout,onpointerover,onpointerrawupdate,onpointerup,onpopstate,onprogress,onratechange,onrejectionhandled,onreset,onresize,onscroll,onsearch,onseeked,onseeking,onselect,onselectionchange,onselectstart,onstalled,onstorage,onsubmit,onsuspend,ontimeupdate,ontoggle,ontransitioncancel,ontransitionend,ontransitionrun,ontransitionstart,onunhandledrejection,onunload,onvolumechange,onwaiting,onwebkitanimationend,onwebkitanimationiteration,onwebkitanimationstart,onwebkittransitionend,onwheel,open,openDatabase,opener,origin,originAgentCluster,outerHeight,outerWidth,pageXOffset,pageYOffset,parent,performance,personalbar,platform,postMessage,print,process,prompt,proto,queueMicrotask,regeneratorRuntime,releaseEvents,reportError,requestAnimationFrame,requestIdleCallback,resizeBy,resizeTo,saveAs,scheduler,screen,screenLeft,screenTop,screenX,screenY,scroll,scrollBy,scrollTo,scrollX,scrollY,scrollbars,self,sessionStorage,setImmediate,setInterval,setIsRunning,setTimeout,showDirectoryPicker,showOpenFilePicker,showSaveFilePicker,speechSynthesis,status,statusbar,stop,styleMedia,toolbar,top,trustedTypes,types,uiKeyring,util,visualViewport,webkitCancelAnimationFrame,webkitRequestAnimationFrame,webkitRequestFileSystem,webkitResolveLocalFileSystemURL,webkitStorageInfo,webpackChunk_polkadot_apps,webpackHotUpdate_polkadot_apps,window}';

function setupInjected ({ api, isDevelopment }: ApiProps, setIsRunning: (isRunning: boolean) => void, hookConsole: (type: LogType, args: any[]) => void): Injected {
  return {
    ...Object
      .keys(window)
      .filter((key) => !key.includes('-') && !ALLOWED_GLOBALS.includes(key))
      .reduce((result: Record<string, null>, key): Record<string, null> => {
        result[key] = null;

        return result;
      }, { ...DEFAULT_NULL }),
    api: api.clone(),
    console: {
      error: (...args: any[]) => hookConsole('error', args),
      log: (...args: any[]) => hookConsole('log', args)
    },
    hashing,
    keyring: isDevelopment
      ? uiKeyring.keyring
      : null,
    setIsRunning,
    types,
    uiKeyring: isDevelopment
      ? uiKeyring
      : null,
    util
  };
}

// FIXME This... ladies & gentlemen, is a mess that should be untangled
function Playground ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const apiProps = useApi();
  const injectedRef = useRef<Injected | null>(null);
  const [code, setCode] = useState('');
  const [isCustomExample, setIsCustomExample] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isWarnOpen, toggleWarnOpen] = useToggle(true);
  const [customExamples, setCustomExamples] = useState<Snippet[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [options, setOptions] = useState<Snippet[]>([]);
  const [selected, setSelected] = useState(snippets[0]);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'playground',
      text: t<string>('Console')
    }
  ]);

  // initialize all options
  useEffect((): void => {
    // add snippets if not already available (global)
    if (!hasSnippetWrappers) {
      snippets.forEach((snippet): void => {
        snippet.code = `${makeWrapper(apiProps.isDevelopment)}${snippet.code}`;
      });

      hasSnippetWrappers = true;
    }

    const localData = {
      examples: localStorage.getItem(STORE_EXAMPLES),
      selectedValue: localStorage.getItem(STORE_SELECTED)
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) as Snippet[] : [];
    const options: Snippet[] = [...customExamples, ...snippets];
    const selected = options.find((option): boolean => option.value === localData.selectedValue);

    setCustomExamples(customExamples);
    setIsCustomExample((selected && selected.type === 'custom') || false);
    setOptions(options);
    setSelected(selected || snippets[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    setCode(selected.code);
  }, [selected]);

  const _clearConsole = useCallback(
    (): void => setLogs([]),
    []
  );

  const _hookConsole = useCallback(
    (type: LogType, args: any[]): void => {
      logs.push({ args, type });
      setLogs(logs.slice(0));
    },
    [logs]
  );

  const _stopJs = useCallback(
    (): void => {
      if (injectedRef.current) {
        injectedRef.current.api.disconnect().catch(console.error);
        injectedRef.current = null;
      }

      setIsRunning(false);
    },
    []
  );

  const _runJs = useCallback(
    async (): Promise<void> => {
      setIsRunning(true);
      _clearConsole();

      injectedRef.current = setupInjected(apiProps, setIsRunning, _hookConsole);

      await injectedRef.current.api.isReady;

      try {
        // squash into a single line so exceptions (with line numbers) maps to the
        // same line/origin as we have in the editor view
        // TODO: Make the console.error here actually return the full stack
        const exec = `(async (${archiveParams}) => { try { ${code} \n } catch (error) { console.error(error); setIsRunning(false); } })(injected);`;

        // eslint-disable-next-line no-new-func,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-implied-eval
        new Function('injected', exec).bind({}, injectedRef.current)();
      } catch (error) {
        injectedRef.current.console.error(error);
      }

      setIsRunning(false);
    },
    [_clearConsole, _hookConsole, apiProps, code]
  );

  const _selectExample = useCallback(
    (value: string): void => {
      _stopJs();

      if (value.length) {
        const option = options.find((option): boolean => option.value === value);

        if (option) {
          localStorage.setItem(STORE_SELECTED, value);

          _clearConsole();
          setIsCustomExample(option.type === 'custom');
          setSelected(option);
        }
      }
    },
    [_clearConsole, _stopJs, options]
  );

  const _removeSnippet = useCallback(
    (): void => {
      const filtered = customExamples.filter((value): boolean => value.value !== selected.value);
      const nextOptions = [...filtered, ...snippets];

      setCustomExamples(filtered);
      setIsCustomExample(nextOptions[0].type === 'custom');
      setOptions(nextOptions);
      _selectExample(nextOptions[0].value);
      localStorage.setItem(STORE_EXAMPLES, JSON.stringify(filtered));
    },
    [_selectExample, customExamples, selected.value]
  );

  const _saveSnippet = useCallback(
    (snippetName: string): void => {
      // The <Dropdown> component doesn't take boolean custom props and no
      // camelCase keys, that's why 'custom' is passed as a string here
      const snapshot: Snippet = {
        code,
        label: CUSTOM_LABEL,
        text: snippetName,
        type: 'custom',
        value: `custom-${Date.now()}`
      };
      const options = [snapshot, ...customExamples, ...snippets];

      localStorage.setItem(STORE_EXAMPLES, JSON.stringify([snapshot, ...customExamples]));
      setCustomExamples([snapshot, ...customExamples]);
      setIsCustomExample(true);
      setOptions(options);
      setSelected(snapshot);
    },
    [code, customExamples]
  );

  const snippetName = selected.type === 'custom' ? selected.text : undefined;

  return (
    <main className={`js--App ${className}`}>
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <section className='js--Selection'>
        <Dropdown
          className='js--Dropdown'
          isFull
          label={t<string>('Select example')}
          onChange={_selectExample}
          options={options}
          value={selected.value}
        />
      </section>
      <section className='js--Content'>
        <article className='container js--Editor'>
          <ActionButtons
            isCustomExample={isCustomExample}
            isRunning={isRunning}
            removeSnippet={_removeSnippet}
            runJs={_runJs}
            saveSnippet={_saveSnippet}
            snippetName={snippetName}
            stopJs={_stopJs}
          />
          <Editor
            code={code}
            onEdit={setCode}
          />
        </article>
        <Output
          className='js--Output'
          logs={logs}
        >
          <Button
            className='action-button'
            icon='eraser'
            onClick={_clearConsole}
          />
        </Output>
      </section>
      {isWarnOpen && (
        <div className='warnOverlay'>
          <article className='warning centered'>
            <p>{t('This is a developer tool that allows you to execute selected snippets in a limited context.')}</p>
            <p>{t('Never execute JS snippets from untrusted sources.')}</p>
            <p>{t('Unless you are a developer with insight into what the specific script does to your environment (based on reading the code being executed) generally the advice would be to not use this environment.')}</p>
            <Button.Group>
              <Button
                icon='times'
                label={t('Close')}
                onClick={toggleWarnOpen}
              />
            </Button.Group>
          </article>
        </div>
      )}
    </main>
  );
}

export default React.memo(styled(Playground)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;

  article {
    p:last-child {
      margin-bottom: 0;
    }
  }

  .js--Selection {
    margin-bottom: 1rem;
  }

  .js--Content {
    align-content: stretch;
    align-items: stretch;
    display: flex;
    height: 100%;
    justify-content: space-between;
    margin-bottom: 0;
  }

  .js--Dropdown {
    position: relative;
    z-index: 200;

    .dropdown .menu > .item {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  }

  .js--Editor,
  .js--Output {
    min-width: 200px;

    .action-button {
      margin: 0;
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      z-index: 100;
    }
  }

  .js--Editor {
    flex-grow: 1;
    overflow: auto;
    padding: 0;
    position: relative;
    resize: horizontal;
    width: 60%;

    textarea {
      outline: 0;
    }

    .codeflask {
      background: transparent;
    }

    .codeflask--has-line-numbers {
      z-index: 0;
    }

    .codeflask--has-line-numbers .codeflask__flatten {
      font-size: 12px;
      line-height: 18px;
      min-width: calc(100% - 40px);
      padding-top: 50px;
      width: auto;
    }

    .codeflask__lines {
      background: #f2f2f2;
      line-height: 18px;
      padding-top: 50px;
      z-index: 100;
    }

    &::after {
      bottom: 0;
      content: '↔';
      cursor: col-resize;
      font-size: 20px;
      height: 20px;
      line-height: 18px;
      position: absolute;
      right: 0;
      width: 22px;
      z-index: 1;
    }
  }

  .ui.popup.popup-local {
    display: flex;
    flex: 1 1 100%;
    max-width: 300px;
  }

  .warnOverlay {
    left: 0;
    position: absolute;
    right: 0;
    top: -0.25rem;
    z-index: 202;

    article p:first-child {
      padding-top: 1rem;
    }

    .ui--Button-Group {
      margin-bottom: 0;
    }
  }
`);
