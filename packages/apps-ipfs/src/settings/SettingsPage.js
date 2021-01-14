// [object Object]
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Trans, withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';
import { connect } from 'redux-bundler-react';

import { cliCmdKeys, cliCommandList } from '../bundles/files/consts';
import AnalyticsToggle from '../components/analytics-toggle/AnalyticsToggle';
import ApiAddressForm from '../components/api-address-form/ApiAddressForm';
import Box from '../components/box/Box';
import Button from '../components/button/Button';
import Checkbox from '../components/checkbox/Checkbox';
import CliTutorMode from '../components/cli-tutor-mode/CliTutorMode';
import withTour from '../components/tour/withTour';
import { getJoyrideLocales } from '../helpers/i8n';
// Components
import Tick from '../icons/GlyphSmallTick';
import StrokeCode from '../icons/StrokeCode';
// Tour
import { settingsTour } from '../lib/tours';
import ComponentLoader from '../loader/ComponentLoader.js';
import JsonEditor from './editor/JsonEditor';
// import Experiments from '../components/experiments/ExperimentsPanel';
import Title from './Title';

const PAUSE_AFTER_SAVE_MS = 3000;

export const SettingsPage = ({ analyticsEnabled, command, config, doToggleAnalytics,
  doToggleCliTutorMode, editorKey, handleJoyrideCallback,
  hasErrors, hasExternalChanges, hasLocalChanges, hasSaveFailed, hasSaveSucceded,
  ipfsPendingFirstConnection, isCliTutorModeEnabled, isConfigBlocked, isIpfsConnected, isLoading, isSaving, onChange,
  onReset, onSave, t, tReady, toursEnabled }) => (
  <div className='center'
    data-id='SettingsPage'>
    {/* Enable a full screen loader after updating to a new IPFS API address.
      * Will not show on consequent retries after a failure.
      */}
    { ipfsPendingFirstConnection
      ? <div className='absolute flex items-center justify-center w-100 h-100'
        style={{ background: 'rgba(255, 255, 255, 0.5)', zIndex: '10' }}>
        <ComponentLoader pastDelay />
      </div>
      : null }

    <Box className='mb3 pa4 joyride-settings-customapi'>
      <div className='lh-copy charcoal'>
        <Title>{t('app:terms.apiAddress')}</Title>
        <Trans i18nKey='apiDescription'
          t={t}>
          <p>If your node is configured with a <a className='link blue'
            href='https://github.com/ipfs/go-ipfs/blob/master/docs/config.md#addresses'
            rel='noopener noreferrer'
            target='_blank'>custom API address</a>, including a port other than the default 5001, enter it here.</p>
        </Trans>
        <ApiAddressForm/>
      </div>
    </Box>

    <Box className='mb3 pa4'>

      <div className='joyride-settings-analytics'>
        <Title>{t('analytics')}</Title>
        <AnalyticsToggle analyticsEnabled={analyticsEnabled}
          doToggleAnalytics={doToggleAnalytics}
          t={t} />
      </div>
    </Box>

    {/* <Experiments t={t} /> */}

    <Box className='mb3 pa4'>
      <div className='charcoal'>
        <Title>{t('cliTutorMode')}</Title>
        <Checkbox checked={isCliTutorModeEnabled}
          className='dib'
          label={<span className='f5 lh-copy'>{t('cliToggle.label')}</span>}
          onChange={doToggleCliTutorMode}/>
        <Trans i18nKey='cliDescription'
          t={t}>
          <p className='f6 mv2'>Enable this option to display a "view code" <StrokeCode className='dib v-mid icon mh1 fill-charcoal'
            style={{ height: 24 }}
            viewBox='14 20 70 66' /> icon next to common IPFS commands. Clicking it opens a modal with that command's CLI code, so you can paste it into the IPFS command-line interface in your terminal.</p>
        </Trans>
      </div>
    </Box>

    { isIpfsConnected &&
    (<Box className='mb3 pa4 joyride-settings-config'>
      <Title>{t('config')}</Title>
      <div className='flex pb3'>
        <div className='flex-auto'>
          <div className='mw7'>
            <SettingsInfo
              config={config}
              hasExternalChanges={hasExternalChanges}
              hasSaveFailed={hasSaveFailed}
              hasSaveSucceded={hasSaveSucceded}
              isConfigBlocked={isConfigBlocked}
              isIpfsConnected={isIpfsConnected}
              isLoading={isLoading}
              t={t}
              tReady={tReady} />
          </div>
        </div>
        { config
          ? (
            <div className='flex flex-column justify-center flex-row-l items-center-l'>
              <CliTutorMode command={command}
                config={config}
                showIcon={true}
                t={t}/>
              <Button
                bg='bg-charcoal'
                className='tc'
                disabled={isSaving || (!hasLocalChanges && !hasExternalChanges)}
                height={40}
                minWidth={100}
                onClick={onReset}>
                {t('app:actions.reset')}
              </Button>
              <SaveButton
                hasErrors={hasErrors}
                hasExternalChanges={hasExternalChanges}
                hasLocalChanges={hasLocalChanges}
                hasSaveFailed={hasSaveFailed}
                hasSaveSucceded={hasSaveSucceded}
                isSaving={isSaving}
                onClick={onSave}
                t={t}
                tReady={tReady} />
            </div>
          )
          : null }
      </div>
      { config
        ? (
          <JsonEditor
            key={editorKey}
            onChange={onChange}
            readOnly={isSaving}
            value={config} />
        )
        : null }
    </Box>
    )}

    <ReactJoyride
      callback={handleJoyrideCallback}
      continuous
      locale={getJoyrideLocales(t)}
      run={toursEnabled}
      scrollToFirstStep
      showProgress
      steps={settingsTour.getSteps({ t, Trans })}
      styles={settingsTour.styles} />
  </div>
);

const SaveButton = ({ hasErrors, hasExternalChanges, hasLocalChanges, hasSaveFailed, hasSaveSucceded, isSaving, onClick, t }) => {
  const bg = hasSaveSucceded ? 'bg-green' : 'bg-teal';

  return (
    <Button
      bg={bg}
      className='mt2 mt0-l ml2-l tc'
      danger={hasSaveFailed || hasExternalChanges}
      disabled={!hasLocalChanges || hasErrors}
      height={40}
      minWidth={100}
      onClick={onClick}>
      { hasSaveSucceded && !hasSaveFailed
        ? (
          <Tick className='fill-snow'
            height={16}
            style={{ transform: 'scale(3)' }} />
        )
        : (
          isSaving ? t('app:actions.saving') : t('app:actions.save')
        )}
    </Button>
  );
};

const SettingsInfo = ({ config, hasExternalChanges, hasSaveFailed, hasSaveSucceded, isConfigBlocked, isIpfsConnected, isLoading, t }) => {
  if (isConfigBlocked) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        {t('configApiNotAvailable')}
      </p>
    );
  } else if (!isIpfsConnected) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        {t('ipfsDaemonOffline')}
      </p>
    );
  } else if (!config) {
    return (
      <p className='ma0 lh-copy charcoal f5 mw7'>
        { isLoading ? t('fetchingSettings') : t('settingsUnavailable') }
      </p>
    );
  } else if (hasExternalChanges) {
    return (
      <p className='ma0 lh-copy red f5 mw7'>
        <Trans i18nKey='settingsHaveChanged'
          t={t}>
          The settings have changed, please click <strong>Reset</strong> to update the editor contents
        </Trans>
      </p>
    );
  } else if (hasSaveFailed) {
    return (
      <p className='ma0 lh-copy red fw6 f5 mw7'>
        {t('errorOccured')}
        <span className='db fw4 f6 charcoal-muted'>{t('checkConsole')}</span>
      </p>
    );
  } else if (hasSaveSucceded) {
    return (
      <p className='ma0 lh-copy green fw6 f5 mw7'>
        {t('changesSaved')}
        <span className='db fw4 f6 charcoal-muted'>{t('settingsWillBeUsedNextTime')}</span>
      </p>
    );
  }

  return (
    <p className='ma0 mr2 lh-copy charcoal f5'>
      {t('ipfsConfigDescription')} <a className='link blue'
        href='https://github.com/ipfs/go-ipfs/blob/master/docs/config.md'
        rel='noopener noreferrer'
        target='_blank'>{t('ipfsConfigHelp')}</a>
    </p>
  );
};

export class SettingsPageContainer extends React.Component {
  state = {
    // valid json?
    hasErrors: false,
    // we edited it
    hasLocalChanges: false,
    // something else edited it
    hasExternalChanges: false,
    // mutable copy of the config
    editableConfig: this.props.config,
    // reset the editor on reset
    editorKey: Date.now()
  }

  onChange = (value) => {
    this.setState({
      hasErrors: !this.isValidJson(value),
      hasLocalChanges: this.props.config !== value,
      editableConfig: value
    });
  }

  onReset = () => {
    this.setState({
      hasErrors: false,
      hasLocalChanges: false,
      hasExternalChanges: false,
      editableConfig: this.props.config,
      editorKey: Date.now()
    });
  }

  onSave = () => {
    this.props.doSaveConfig(this.state.editableConfig);
  }

  isValidJson (str) {
    try {
      JSON.parse(str);

      return true;
    } catch (err) {
      return false;
    }
  }

  isRecent (msSinceEpoch) {
    return msSinceEpoch > Date.now() - PAUSE_AFTER_SAVE_MS;
  }

  componentDidUpdate (prevProps) {
    if (this.props.configSaveLastSuccess !== prevProps.configSaveLastSuccess) {
      setTimeout(() => this.onReset(), PAUSE_AFTER_SAVE_MS);
    }

    if (prevProps.config !== this.props.config) {
      // no previous config, or we just saved.
      if (!prevProps.config || this.isRecent(this.props.configSaveLastSuccess)) {
        return this.setState({
          editableConfig: this.props.config
        });
      }

      // uh oh... something else edited the config while we were looking at it.
      if (this.props.config !== this.state.editableConfig) {
        return this.setState({
          hasExternalChanges: true
        });
      }
    }
  }

  render () {
    const { analyticsEnabled, configIsLoading, configIsSaving, configLastError, configSaveLastError, configSaveLastSuccess, doToggleAnalytics,
      doToggleCliTutorMode, handleJoyrideCallback, ipfsConnected, ipfsPendingFirstConnection, isCliTutorModeEnabled, isConfigBlocked,
      isIpfsDesktop, t, tReady, toursEnabled } = this.props;
    const { editableConfig, editorKey, hasErrors, hasExternalChanges, hasLocalChanges } = this.state;
    const hasSaveSucceded = this.isRecent(configSaveLastSuccess);
    const hasSaveFailed = this.isRecent(configSaveLastError);
    const isLoading = configIsLoading || (!editableConfig && !configLastError);

    return (
      <SettingsPage
        analyticsEnabled={analyticsEnabled}
        command={cliCommandList[cliCmdKeys.UPDATE_IPFS_CONFIG]()}
        config={editableConfig}
        doToggleAnalytics={doToggleAnalytics}
        doToggleCliTutorMode={doToggleCliTutorMode}
        editorKey={editorKey}
        handleJoyrideCallback={handleJoyrideCallback}
        hasErrors={hasErrors}
        hasExternalChanges={hasExternalChanges}
        hasLocalChanges={hasLocalChanges}
        hasSaveFailed={hasSaveFailed}
        hasSaveSucceded={hasSaveSucceded}
        ipfsPendingFirstConnection={ipfsPendingFirstConnection}
        isCliTutorModeEnabled={isCliTutorModeEnabled}
        isConfigBlocked={isConfigBlocked}
        isIpfsConnected={ipfsConnected}
        isIpfsDesktop={isIpfsDesktop}
        isLoading={isLoading}
        isSaving={configIsSaving}
        onChange={this.onChange}
        onReset={this.onReset}
        onSave={this.onSave}
        t={t}
        tReady={tReady}
        toursEnabled={toursEnabled}
      />
    );
  }
}

export const TranslatedSettingsPage = withTranslation('settings')(SettingsPageContainer);

export default connect(
  'selectConfig',
  'selectIpfsConnected',
  'selectIpfsPendingFirstConnection',
  'selectIsConfigBlocked',
  'selectConfigLastError',
  'selectConfigIsLoading',
  'selectConfigIsSaving',
  'selectConfigSaveLastSuccess',
  'selectConfigSaveLastError',
  'selectIsIpfsDesktop',
  'selectToursEnabled',
  'selectAnalyticsEnabled',
  'doToggleAnalytics',
  'doSaveConfig',
  'selectIsCliTutorModeEnabled',
  'doToggleCliTutorMode',
  withTour(TranslatedSettingsPage)
);
