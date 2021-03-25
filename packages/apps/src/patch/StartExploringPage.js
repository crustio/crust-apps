// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import AboutIpld from 'ipld-explorer-components/dist/components/about/AboutIpld';
import IpldExploreForm from 'ipld-explorer-components/dist/components/explore/IpldExploreForm';
import { colorForNode, nameForNode, shortNameForNode } from 'ipld-explorer-components/dist/components/object-info/ObjectInfo';
import { projectsTour } from 'ipld-explorer-components/dist/lib/tours';
import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactJoyride from 'react-joyride';

const ExploreSuggestion = function ExploreSuggestion (_ref) {
  const cid = _ref.cid;
  const name = _ref.name;
  const type = _ref.type;

  return /* #__PURE__ */React.createElement('a', {
    className: 'flex items-center lh-copy pl3 pl0-l pv3 bb b--black-10 link focus-outline',
    href: '#/storage/explore/'.concat(cid)
  }, /* #__PURE__ */React.createElement('span', {
    className: 'flex items-center justify-center w3 h3 flex-none br-100 tc',
    style: {
      background: colorForNode(type)
    }
  }, /* #__PURE__ */React.createElement('span', {
    className: 'montserrat fw2 f4 snow',
    title: nameForNode(type)
  }, shortNameForNode(type))), /* #__PURE__ */React.createElement('span', {
    className: 'pl3 truncate'
  }, /* #__PURE__ */React.createElement('h2', {
    className: 'ma0 fw4 f5 db black montserrat'
  }, name), /* #__PURE__ */React.createElement('span', {
    className: 'f7 db blue truncate monospace'
  }, cid)));
};

const StartExploringPage = function StartExploringPage (_ref2) {
  const t = _ref2.t;
  const embed = _ref2.embed;
  const _ref2$runTour = _ref2.runTour;
  const runTour = _ref2$runTour === void 0 ? false : _ref2$runTour;
  const joyrideCallback = _ref2.joyrideCallback;

  return /* #__PURE__ */React.createElement('div', {
    className: 'm10 center explore-sug-2'
  }, /* #__PURE__ */React.createElement('div', {
    className: 'flex-l'
  }, /* #__PURE__ */React.createElement('div', {
    className: 'flex-auto-l mr3-l'
  }, /* #__PURE__ */React.createElement('div', {
    className: 'pl3 pl0-l pt4 pt2-l'
  }, /* #__PURE__ */React.createElement('h1', {
    className: 'f3 f2-l ma0 fw4 montserrat charcoal'
  }, t('StartExploringPage.header')), /* #__PURE__ */React.createElement('p', {
    className: 'lh-copy f5 avenir charcoal-muted'
  }, t('StartExploringPage.leadParagraph'))), embed ? /* #__PURE__ */React.createElement(IpldExploreForm, null) : null, /* #__PURE__ */React.createElement('ul', {
    className: 'list pl0 ma0 mt4 mt0-l bt bn-l b--black-10'
  }, /* #__PURE__ */React.createElement('li', null, /* #__PURE__ */React.createElement(ExploreSuggestion, {
    name: 'Project Apollo Archives',
    cid: 'QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D',
    type: 'dag-pb'
  })), /* #__PURE__ */React.createElement('li', null, /* #__PURE__ */React.createElement(ExploreSuggestion, {
    name: 'IGIS git repo',
    cid: 'z8mWaJHXieAVxxLagBpdaNWFEBKVWmMiE',
    type: 'git-raw'
  })), /* #__PURE__ */React.createElement('li', null, /* #__PURE__ */React.createElement(ExploreSuggestion, {
    name: 'An Ethereum Block',
    cid: 'z43AaGEvwdfzjrCZ3Sq7DKxdDHrwoaPQDtqF4jfdkNEVTiqGVFW',
    type: 'eth-block'
  })), /* #__PURE__ */React.createElement('li', null, /* #__PURE__ */React.createElement(ExploreSuggestion, {
    name: 'XKCD',
    cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm',
    type: 'dag-pb'
  })))), /* #__PURE__ */React.createElement('div', {
    className: 'pt2-l'
  }, /* #__PURE__ */React.createElement(AboutIpld, null))), /* #__PURE__ */React.createElement(ReactJoyride, {
    run: runTour,
    steps: projectsTour.getSteps({
      t: t
    }),
    styles: projectsTour.styles,
    callback: joyrideCallback,
    scrollToFirstStep: true
  }));
};

export default withTranslation('explore')(StartExploringPage);
