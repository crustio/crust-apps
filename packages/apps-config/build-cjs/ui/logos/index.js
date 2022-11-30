"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specLogos = exports.nodeLogos = exports.namedLogos = exports.externalLogos = exports.extensionLogos = exports.emptyLogos = exports.chainLogos = void 0;
var _util = require("../util");
var _acala = _interopRequireDefault(require("./chains/acala.svg"));
var _aleph = _interopRequireDefault(require("./chains/aleph.svg"));
var _altair = _interopRequireDefault(require("./chains/altair.svg"));
var _amplitude = _interopRequireDefault(require("./chains/amplitude.svg"));
var _astar = _interopRequireDefault(require("./chains/astar.png"));
var _aventus = _interopRequireDefault(require("./chains/aventus.svg"));
var _bitgreen = _interopRequireDefault(require("./chains/bitgreen.png"));
var _brainstorm = _interopRequireDefault(require("./chains/brainstorm.png"));
var _coinversation = _interopRequireDefault(require("./chains/coinversation.png"));
var _competitorsClub = _interopRequireDefault(require("./chains/competitors-club.png"));
var _composableFinance = _interopRequireDefault(require("./chains/composableFinance.png"));
var _creditcoin = _interopRequireDefault(require("./chains/creditcoin.png"));
var _creditcoinTest = _interopRequireDefault(require("./chains/creditcoin-test.png"));
var _crownSterling = _interopRequireDefault(require("./chains/crown-sterling.png"));
var _dali = _interopRequireDefault(require("./chains/dali.png"));
var _datahighway = _interopRequireDefault(require("./chains/datahighway.png"));
var _dorafactory = _interopRequireDefault(require("./chains/dorafactory.png"));
var _efinity = _interopRequireDefault(require("./chains/efinity.svg"));
var _equilibrium = _interopRequireDefault(require("./chains/equilibrium.svg"));
var _geminis = _interopRequireDefault(require("./chains/geminis.png"));
var _genshiro = _interopRequireDefault(require("./chains/genshiro.svg"));
var _gm = _interopRequireDefault(require("./chains/gm.png"));
var _hydrate = _interopRequireDefault(require("./chains/hydrate.png"));
var _interlay = _interopRequireDefault(require("./chains/interlay.svg"));
var _kabocha = _interopRequireDefault(require("./chains/kabocha.svg"));
var _karura = _interopRequireDefault(require("./chains/karura.svg"));
var _kico = _interopRequireDefault(require("./chains/kico.png"));
var _kintsugi = _interopRequireDefault(require("./chains/kintsugi.png"));
var _kusama = _interopRequireDefault(require("./chains/kusama-128.gif"));
var _listen = _interopRequireDefault(require("./chains/listen.png"));
var _logion = _interopRequireDefault(require("./chains/logion.png"));
var _mangatax = _interopRequireDefault(require("./chains/mangatax.svg"));
var _moonsama = _interopRequireDefault(require("./chains/moonsama.png"));
var _myriad = _interopRequireDefault(require("./chains/myriad.svg"));
var _oak = _interopRequireDefault(require("./chains/oak.png"));
var _oli = _interopRequireDefault(require("./chains/oli.svg"));
var _omnibtc = _interopRequireDefault(require("./chains/omnibtc.svg"));
var _opalLogo = _interopRequireDefault(require("./chains/opal-logo.png"));
var _origintrail = _interopRequireDefault(require("./chains/origintrail.png"));
var _origintrailTestnet = _interopRequireDefault(require("./chains/origintrail-testnet.png"));
var _parallel = _interopRequireDefault(require("./chains/parallel.svg"));
var _picasso = _interopRequireDefault(require("./chains/picasso.svg"));
var _quartz = _interopRequireDefault(require("./chains/quartz.png"));
var _rocfinity = _interopRequireDefault(require("./chains/rocfinity.svg"));
var _rococo = _interopRequireDefault(require("./chains/rococo.svg"));
var _rococoContracts = _interopRequireDefault(require("./chains/rococo-contracts.png"));
var _rococoTick = _interopRequireDefault(require("./chains/rococo-tick.svg"));
var _rococoTrack = _interopRequireDefault(require("./chains/rococo-track.svg"));
var _rococoTrick = _interopRequireDefault(require("./chains/rococo-trick.svg"));
var _shiden = _interopRequireDefault(require("./chains/shiden.png"));
var _skyekiwi = _interopRequireDefault(require("./chains/skyekiwi.png"));
var _snakenet = _interopRequireDefault(require("./chains/snakenet.svg"));
var _snowbridge = _interopRequireDefault(require("./chains/snowbridge.png"));
var _spanner = _interopRequireDefault(require("./chains/spanner.png"));
var _standard = _interopRequireDefault(require("./chains/standard.png"));
var _t0rn = _interopRequireDefault(require("./chains/t0rn.png"));
var _tanganika = _interopRequireDefault(require("./chains/tanganika.png"));
var _tinker = _interopRequireDefault(require("./chains/tinker.png"));
var _totem = _interopRequireDefault(require("./chains/totem.svg"));
var _turing = _interopRequireDefault(require("./chains/turing.png"));
var _unique = _interopRequireDefault(require("./chains/unique.svg"));
var _unorthodox = _interopRequireDefault(require("./chains/unorthodox.png"));
var _vara = _interopRequireDefault(require("./chains/vara.svg"));
var _virto = _interopRequireDefault(require("./chains/virto.png"));
var _watr = _interopRequireDefault(require("./chains/watr.png"));
var _webb = _interopRequireDefault(require("./chains/webb.png"));
var _westendCollectives = _interopRequireDefault(require("./chains/westend-collectives.png"));
var _polkadotJs = _interopRequireDefault(require("./extensions/polkadot-js.svg"));
var _commonwealth = _interopRequireDefault(require("./external/commonwealth.png"));
var _dotreasury = _interopRequireDefault(require("./external/dotreasury.svg"));
var _dotscanner = _interopRequireDefault(require("./external/dotscanner.png"));
var _kodadot = _interopRequireDefault(require("./external/kodadot.png"));
var _polkaholic = _interopRequireDefault(require("./external/polkaholic.png"));
var _polkascan = _interopRequireDefault(require("./external/polkascan.png"));
var _polkassembly = _interopRequireDefault(require("./external/polkassembly.png"));
var _polkastats = _interopRequireDefault(require("./external/polkastats.png"));
var _singular = _interopRequireDefault(require("./external/singular.svg"));
var _statescan = _interopRequireDefault(require("./external/statescan.svg"));
var _subid = _interopRequireDefault(require("./external/subid.svg"));
var _subscan = _interopRequireDefault(require("./external/subscan.png"));
var _subsquare = _interopRequireDefault(require("./external/subsquare.svg"));
var _rocky = _interopRequireDefault(require("./nodes/rocky.svg"));
var _ajuna = _interopRequireDefault(require("./nodes/ajuna.png"));
var _apron = _interopRequireDefault(require("./nodes/apron.png"));
var _arctic = _interopRequireDefault(require("./nodes/arctic.png"));
var _ares = _interopRequireDefault(require("./nodes/ares.png"));
var _aresGladios = _interopRequireDefault(require("./nodes/ares-gladios.svg"));
var _aresMars = _interopRequireDefault(require("./nodes/ares-mars.png"));
var _aresOdyssey = _interopRequireDefault(require("./nodes/ares-odyssey.svg"));
var _astar2 = _interopRequireDefault(require("./nodes/astar.png"));
var _automata = _interopRequireDefault(require("./nodes/automata.png"));
var _aventus2 = _interopRequireDefault(require("./nodes/aventus.svg"));
var _bajun = _interopRequireDefault(require("./nodes/bajun.png"));
var _basilisk = _interopRequireDefault(require("./nodes/basilisk.png"));
var _beast = _interopRequireDefault(require("./nodes/beast.svg"));
var _bifrost = _interopRequireDefault(require("./nodes/bifrost.svg"));
var _bitcountry = _interopRequireDefault(require("./nodes/bitcountry.png"));
var _calamari = _interopRequireDefault(require("./nodes/calamari.png"));
var _centrifuge = _interopRequireDefault(require("./nodes/centrifuge.png"));
var _cess = _interopRequireDefault(require("./nodes/cess.png"));
var _chainx = _interopRequireDefault(require("./nodes/chainx.svg"));
var _clover = _interopRequireDefault(require("./nodes/clover.svg"));
var _coinversation2 = _interopRequireDefault(require("./nodes/coinversation.png"));
var _competitorsClub2 = _interopRequireDefault(require("./nodes/competitors-club.png"));
var _confti = _interopRequireDefault(require("./nodes/confti.svg"));
var _crab = _interopRequireDefault(require("./nodes/crab.svg"));
var _crownSterling2 = _interopRequireDefault(require("./nodes/crown-sterling.png"));
var _crust = _interopRequireDefault(require("./nodes/crust.svg"));
var _crustMaxwell = _interopRequireDefault(require("./nodes/crust-maxwell.svg"));
var _crustParachain = _interopRequireDefault(require("./nodes/crustParachain.svg"));
var _dali2 = _interopRequireDefault(require("./nodes/dali.png"));
var _darwinia = _interopRequireDefault(require("./nodes/darwinia.svg"));
var _datahighway2 = _interopRequireDefault(require("./nodes/datahighway.png"));
var _dockMainnet = _interopRequireDefault(require("./nodes/dock-mainnet.png"));
var _dockTestnet = _interopRequireDefault(require("./nodes/dock-testnet.png"));
var _dolphin = _interopRequireDefault(require("./nodes/dolphin.svg"));
var _dotmog = _interopRequireDefault(require("./nodes/dotmog.svg"));
var _eave = _interopRequireDefault(require("./nodes/eave.svg"));
var _edgewareWhite = _interopRequireDefault(require("./nodes/edgeware-white.png"));
var _efinity2 = _interopRequireDefault(require("./nodes/efinity.svg"));
var _encointerBlue = _interopRequireDefault(require("./nodes/encointer-blue.svg"));
var _fantour = _interopRequireDefault(require("./nodes/fantour.png"));
var _frequencyRococo = _interopRequireDefault(require("./nodes/frequencyRococo.png"));
var _galitalLogo = _interopRequireDefault(require("./nodes/galital-logo.png"));
var _gamepower = _interopRequireDefault(require("./nodes/gamepower.svg"));
var _geek = _interopRequireDefault(require("./nodes/geek.svg"));
var _hanonycash = _interopRequireDefault(require("./nodes/hanonycash.svg"));
var _helixstreet = _interopRequireDefault(require("./nodes/helixstreet.png"));
var _idavoll = _interopRequireDefault(require("./nodes/idavoll.png"));
var _imbue = _interopRequireDefault(require("./nodes/imbue.png"));
var _integritee = _interopRequireDefault(require("./nodes/integritee.svg"));
var _interlay2 = _interopRequireDefault(require("./nodes/interlay.svg"));
var _ipci = _interopRequireDefault(require("./nodes/ipci.svg"));
var _ipse = _interopRequireDefault(require("./nodes/ipse.png"));
var _jaz = _interopRequireDefault(require("./nodes/jaz.png"));
var _joystream = _interopRequireDefault(require("./nodes/joystream.svg"));
var _jupiter = _interopRequireDefault(require("./nodes/jupiter.svg"));
var _kabocha2 = _interopRequireDefault(require("./nodes/kabocha.svg"));
var _khala = _interopRequireDefault(require("./nodes/khala.svg"));
var _kilt = _interopRequireDefault(require("./nodes/kilt.png"));
var _klug = _interopRequireDefault(require("./nodes/klug.png"));
var _konomi = _interopRequireDefault(require("./nodes/konomi.png"));
var _kulupu = _interopRequireDefault(require("./nodes/kulupu.svg"));
var _kusari = _interopRequireDefault(require("./nodes/kusari.svg"));
var _kylin = _interopRequireDefault(require("./nodes/kylin.png"));
var _laminarCircle = _interopRequireDefault(require("./nodes/laminar-circle.svg"));
var _litentry = _interopRequireDefault(require("./nodes/litentry.png"));
var _litmus = _interopRequireDefault(require("./nodes/litmus.png"));
var _loom_network = _interopRequireDefault(require("./nodes/loom_network.png"));
var _manta = _interopRequireDefault(require("./nodes/manta.png"));
var _math = _interopRequireDefault(require("./nodes/math.svg"));
var _md = _interopRequireDefault(require("./nodes/md5.png"));
var _minix = _interopRequireDefault(require("./nodes/minix.png"));
var _moonbase_alpha = _interopRequireDefault(require("./nodes/moonbase_alpha.png"));
var _moonbeam = _interopRequireDefault(require("./nodes/moonbeam.png"));
var _moonriver = _interopRequireDefault(require("./nodes/moonriver.svg"));
var _moonrock = _interopRequireDefault(require("./nodes/moonrock.png"));
var _moonshadow = _interopRequireDefault(require("./nodes/moonshadow.png"));
var _mybank = _interopRequireDefault(require("./nodes/mybank.png"));
var _nftmart = _interopRequireDefault(require("./nodes/nftmart.png"));
var _nodle = _interopRequireDefault(require("./nodes/nodle.svg"));
var _oli2 = _interopRequireDefault(require("./nodes/oli.svg"));
var _omnibtc2 = _interopRequireDefault(require("./nodes/omnibtc.svg"));
var _opalLogo2 = _interopRequireDefault(require("./nodes/opal-logo.png"));
var _opportunity = _interopRequireDefault(require("./nodes/opportunity.png"));
var _pangolin = _interopRequireDefault(require("./nodes/pangolin.svg"));
var _pangoro = _interopRequireDefault(require("./nodes/pangoro.svg"));
var _parallel2 = _interopRequireDefault(require("./nodes/parallel.svg"));
var _parami = _interopRequireDefault(require("./nodes/parami.png"));
var _phala = _interopRequireDefault(require("./nodes/phala.svg"));
var _phoenix = _interopRequireDefault(require("./nodes/phoenix.png"));
var _pichiu = _interopRequireDefault(require("./nodes/pichiu.png"));
var _pioneer = _interopRequireDefault(require("./nodes/pioneer.png"));
var _polkadex = _interopRequireDefault(require("./nodes/polkadex.svg"));
var _polkadotCircle = _interopRequireDefault(require("./nodes/polkadot-circle.svg"));
var _polkadotJs2 = _interopRequireDefault(require("./nodes/polkadot-js.svg"));
var _polkafoundry = _interopRequireDefault(require("./nodes/polkafoundry.svg"));
var _polkasmith = _interopRequireDefault(require("./nodes/polkasmith.svg"));
var _polymesh = _interopRequireDefault(require("./nodes/polymesh.svg"));
var _pontem = _interopRequireDefault(require("./nodes/pontem.svg"));
var _prism = _interopRequireDefault(require("./nodes/prism.png"));
var _quartz2 = _interopRequireDefault(require("./nodes/quartz.png"));
var _realis = _interopRequireDefault(require("./nodes/realis.png"));
var _riochain = _interopRequireDefault(require("./nodes/riochain.svg"));
var _robonomics = _interopRequireDefault(require("./nodes/robonomics.svg"));
var _rocfinity2 = _interopRequireDefault(require("./nodes/rocfinity.svg"));
var _sakura = _interopRequireDefault(require("./nodes/sakura.svg"));
var _shadow = _interopRequireDefault(require("./nodes/shadow.svg"));
var _shell = _interopRequireDefault(require("./nodes/shell.svg"));
var _sherpax = _interopRequireDefault(require("./nodes/sherpax.png"));
var _singlavender = _interopRequireDefault(require("./nodes/singlavender.svg"));
var _snow = _interopRequireDefault(require("./nodes/snow.png"));
var _soonsocial = _interopRequireDefault(require("./nodes/soonsocial.png"));
var _soonsocialX = _interopRequireDefault(require("./nodes/soonsocialX.png"));
var _soraSubstrate = _interopRequireDefault(require("./nodes/sora-substrate.svg"));
var _stafi = _interopRequireDefault(require("./nodes/stafi.png"));
var _statemine = _interopRequireDefault(require("./nodes/statemine.svg"));
var _subdao = _interopRequireDefault(require("./nodes/subdao.png"));
var _subgame = _interopRequireDefault(require("./nodes/subgame.svg"));
var _subsocial = _interopRequireDefault(require("./nodes/subsocial.svg"));
var _subsocialX = _interopRequireDefault(require("./nodes/subsocialX.svg"));
var _subspace = _interopRequireDefault(require("./nodes/subspace.png"));
var _substrateContractsNode = _interopRequireDefault(require("./nodes/substrate-contracts-node.png"));
var _substrateHexagon = _interopRequireDefault(require("./nodes/substrate-hexagon.svg"));
var _swapdex = _interopRequireDefault(require("./nodes/swapdex.svg"));
var _ternoa = _interopRequireDefault(require("./nodes/ternoa.svg"));
var _trustbase = _interopRequireDefault(require("./nodes/trustbase.png"));
var _uniarts = _interopRequireDefault(require("./nodes/uniarts.png"));
var _unique2 = _interopRequireDefault(require("./nodes/unique.svg"));
var _unitv = _interopRequireDefault(require("./nodes/unitv.png"));
var _valiu = _interopRequireDefault(require("./nodes/valiu.png"));
var _vara2 = _interopRequireDefault(require("./nodes/vara.svg"));
var _web3games = _interopRequireDefault(require("./nodes/web3games.svg"));
var _westend_colour = _interopRequireDefault(require("./nodes/westend_colour.svg"));
var _westlake = _interopRequireDefault(require("./nodes/westlake.png"));
var _whala = _interopRequireDefault(require("./nodes/whala.svg"));
var _zCloak = _interopRequireDefault(require("./nodes/zCloak.svg"));
var _zeitgeist = _interopRequireDefault(require("./nodes/zeitgeist.png"));
var _zenlink = _interopRequireDefault(require("./nodes/zenlink.svg"));
var _zero = _interopRequireDefault(require("./nodes/zero.svg"));
var _empty = _interopRequireDefault(require("./empty.svg"));
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical

// last-resort fallback, just something empty

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
const chainLogos = Object.entries({
  'Ajuna Testnet': _ajuna.default,
  'Aleph Zero': _aleph.default,
  'Aleph Zero Testnet': _aleph.default,
  Altair: _altair.default,
  Amplitude: _amplitude.default,
  'Apron PC1': _apron.default,
  Arctic: _arctic.default,
  'Ares Gladios': _aresGladios.default,
  'Ares Odyssey': _aresOdyssey.default,
  'Ares PC1': _ares.default,
  Astar: _astar.default,
  Automata: _automata.default,
  'Automata ContextFree': _automata.default,
  Aventus: _aventus.default,
  'Bajun Testnet': _bajun.default,
  'Beast Developer': _beast.default,
  Bifrost: _bifrost.default,
  'Bifrost Asgard CC4': _bifrost.default,
  'Bifrost K Rococo': _bifrost.default,
  'Bifrost Kusama': _bifrost.default,
  'Bifrost Polkadot': _bifrost.default,
  'Bifrost Stage Testnet': _bifrost.default,
  Bitgreen: _bitgreen.default,
  BitgreenRococo: _bitgreen.default,
  'Calamari Parachain': _calamari.default,
  'Calamari Parachain Development': _calamari.default,
  'Calamari Parachain Local': _calamari.default,
  'Calamari Parachain Testnet': _calamari.default,
  'Catalyst Testnet': _centrifuge.default,
  Centrifuge: _centrifuge.default,
  'CESS Testnet': _cess.default,
  ChainOLI: _oli.default,
  ChainX: _chainx.default,
  'Charcoal Testnet': _centrifuge.default,
  Coinversation: _coinversation.default,
  'Competitors Club': _competitorsClub.default,
  'Composable Finance': _composableFinance.default,
  'Contracts on Rococo': _rococoContracts.default,
  'Crab Parachain': _crab.default,
  Creditcoin: _creditcoin.default,
  'Creditcoin Testnet': _creditcoinTest.default,
  'Crown Sterling': _crownSterling.default,
  'Crust Maxwell': _crustMaxwell.default,
  'Crust PC1': _crust.default,
  'Crust Testnet': _crustParachain.default,
  'darwinia crab': _crab.default,
  'Darwinia Crab PC2': _crab.default,
  'Darwinia Parachain': _darwinia.default,
  'Darwinia PC2': _darwinia.default,
  DataHighway: _datahighway2.default,
  'DataHighway Spreehafen Rococo Parachain Testnet': _datahighway.default,
  'DataHighway Tanganika Kusama Parachain': _tanganika.default,
  'Dolphin Testnet': _dolphin.default,
  'Dora Factory': _dorafactory.default,
  Efinity: _efinity.default,
  'Egg Rococo': _webb.default,
  Equilibrium: _equilibrium.default,
  'Equilibrium parachain': _equilibrium.default,
  EquilibriumTestnet: _equilibrium.default,
  Galital: _galitalLogo.default,
  'GamePower Network': _gamepower.default,
  GEEK: _geek.default,
  Geminis: _geminis.default,
  Genshiro: _genshiro.default,
  'Genshiro Rococo Testnet': _genshiro.default,
  'GM Parachain': _gm.default,
  helixstreet: _helixstreet.default,
  HydraDX: _snakenet.default,
  'HydraDX testnet': _hydrate.default,
  Idavoll: _idavoll.default,
  'Imbue Testnet': _imbue.default,
  InterBTC: _interlay2.default,
  'InterBTC Staging': _interlay2.default,
  Interlay: _interlay.default,
  'InvArch Brainstorm Testnet': _brainstorm.default,
  'InvArch Tinker Network': _tinker.default,
  ipci: _ipci.default,
  IpseTestnet: _ipse.default,
  'Jupiter A1': _jupiter.default,
  'Jupiter PC1': _jupiter.default,
  Kabocha: _kabocha.default,
  'Kabocha (kabsoup)': _kabocha.default,
  Kapex: _totem.default,
  Karura: _karura.default,
  Kerria: _parallel.default,
  'Kerria Dev': _parallel.default,
  Khala: _khala.default,
  KICO: _kico.default,
  KILT: _kilt.default,
  'KILT Local': _kilt.default,
  'KILT Peregrine': _kilt.default,
  'KILT Testnet': _kilt.default,
  Kintsugi: _kintsugi.default,
  KlugDossier: _klug.default,
  Konomi: _konomi.default,
  Kpron: _apron.default,
  Kusama: _kusama.default,
  // new name after CC3
  'Kusama CC1': _kusama.default,
  'Kusama CC2': _kusama.default,
  'Kusama CC3': _kusama.default,
  kusari: _kusari.default,
  'Kylin Testnet': _kylin.default,
  'Listen Network': _listen.default,
  Litentry: _litentry.default,
  'Litentry-rococo': _litentry.default,
  Litmus: _litmus.default,
  'Loom Network Local': _loom_network.default,
  LoomNetwork: _loom_network.default,
  'Mangata Kusama Mainnet': _mangatax.default,
  'Mangata Public Testnet': _mangatax.default,
  'Manta Parachain': _manta.default,
  'Manta Parachain Development': _manta.default,
  'Manta Parachain Local': _manta.default,
  'Manta Parachain Testnet': _manta.default,
  Mars: _aresMars.default,
  MathChain: _math.default,
  'MathChain PC1': _math.default,
  'mathchain-galois': _math.default,
  MD5: _md.default,
  Minix: _minix.default,
  'Minix Testnet': _minix.default,
  'Moonbase Alpha': _moonbase_alpha.default,
  'Moonbase Development Testnet': _moonbase_alpha.default,
  'Moonbase Stage': _moonbase_alpha.default,
  Moonbeam: _moonbeam.default,
  Moonriver: _moonriver.default,
  Moonrock: _moonrock.default,
  'Moonsama Development': _moonsama.default,
  Moonshadow: _moonshadow.default,
  'mybank.network PC1': _mybank.default,
  Myriad: _myriad.default,
  NFTMart: _nftmart.default,
  'NFTMart Staging': _nftmart.default,
  'NFTMart Testnet': _nftmart.default,
  'OAK Network': _oak.default,
  Odyssey: _aresOdyssey.default,
  'OLI Parachain': _oli.default,
  OmniBTC: _omnibtc.default,
  'OPAL by UNIQUE': _opalLogo.default,
  'OriginTrail Parachain': _origintrail.default,
  'OriginTrail Parachain Testnet': _origintrailTestnet.default,
  Pangolin: _pangolin.default,
  Pangoro: _pangoro.default,
  Parallel: _parallel.default,
  'Parallel Dev': _parallel.default,
  'Parallel Heiko': _parallel.default,
  'Parallel Heiko Dev': _parallel.default,
  'Parami PC2': _parami.default,
  Phala: _phala.default,
  'PHOENIX PC1': _phoenix.default,
  Picasso: _picasso.default,
  'Pichiu Mainnet': _pichiu.default,
  'Pichiu Testnet': _pichiu.default,
  'Pioneer Network': _pioneer.default,
  'Polkadex Mainnet': _polkadex.default,
  'Polkadex Testnet': _polkadex.default,
  'PolkaFoundry PC1': _polkafoundry.default,
  'Pontem Testnet': _pontem.default,
  'Prism PC1': _prism.default,
  'Prism Testnet': _prism.default,
  'QUARTZ by UNIQUE': _quartz.default,
  'ReAlis Network': _realis.default,
  'RioChain CC-1': _riochain.default,
  'RioChain Staging': _riochain.default,
  Robonomics: _robonomics.default,
  Rocfinity: _rocfinity.default,
  Rococo: _rococo.default,
  Sherpax: _sherpax.default,
  'Sherpax Testnet': _sherpax.default,
  Shiden: _shiden.default,
  SingLavender: _singlavender.default,
  SkyeKiwi: _skyekiwi.default,
  'Snow Kusama': _snow.default,
  soonsocial: _soonsocial.default,
  soonsocialX: _soonsocialX.default,
  SORA: _soraSubstrate.default,
  'SORA Kusama': _soraSubstrate.default,
  'SORA Rococo': _soraSubstrate.default,
  Spanner: _spanner.default,
  Stagex: _totem.default,
  Statemine: _statemine.default,
  'Statemine Test': _statemine.default,
  'Statemint Test': _statemine.default,
  'Steam PC': _eave.default,
  subdao: _subdao.default,
  'SubDAO PC1': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  subsocial: _subsocial.default,
  subsocialX: _subsocialX.default,
  subspace: _subspace.default,
  Subzero: _zero.default,
  swapdex: _swapdex.default,
  t0rn: _t0rn.default,
  Tick: _rococoTick.default,
  Track: _rococoTrack.default,
  Trick: _rococoTrick.default,
  trustbase: _trustbase.default,
  'TrustBase PC1': _trustbase.default,
  turing: _turing.default,
  'uni arts staging network': _uniarts.default,
  'UniArts Mainnet': _uniarts.default,
  Unique: _unique.default,
  UNIQUE: _unique.default,
  'Unit Network': _unitv.default,
  Unorthodox: _unorthodox.default,
  'Vara Network': _vara.default,
  VirtoRococo: _virto.default,
  Vln: _valiu.default,
  'VLN PC': _valiu.default,
  Wapex: _totem.default,
  'Watr Network': _watr.default,
  'Web3Games Plum': _web3games.default,
  Westend: _westend_colour.default,
  'Westend Collectives': _westendCollectives.default,
  Westlake: _westlake.default,
  Westmint: _statemine.default,
  'Westmint Test': _statemine.default,
  WILT: _kilt.default,
  'zcloak poc1': _zCloak.default
}).reduce((logos, _ref) => {
  let [chain, logo] = _ref;
  return {
    ...logos,
    [(0, _util.sanitize)(chain)]: logo
  };
}, {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
exports.chainLogos = chainLogos;
const nodeLogos = Object.entries({
  'Acala Node': _acala.default,
  'Ajuna Node': _ajuna.default,
  Amplitude: _amplitude.default,
  'Apron Node': _apron.default,
  'Apron Parachain Collator': _apron.default,
  Arctic: _arctic.default,
  'Ares Gladios': _aresGladios.default,
  'Ares Node': _ares.default,
  'Ares Odyssey': _aresOdyssey.default,
  'Ares Parachain Collator': _ares.default,
  Astar: _astar2.default,
  'Automata ContextFree Node': _automata.default,
  'Automata Node': _automata.default,
  Aventus: _aventus2.default,
  'Bajun Node': _bajun.default,
  Basilisk: _basilisk.default,
  'Beast Node': _beast.default,
  Bifrost: _bifrost.default,
  'Bifrost Node': _bifrost.default,
  'Bifrost Stage Testnet': _bifrost.default,
  'Bit Country Tewai Parachain Collator': _bitcountry.default,
  'Bit.Country': _bitcountry.default,
  'BitCountry Node': _bitcountry.default,
  'Calamari Parachain Collator': _calamari.default,
  Centrifuge: _centrifuge.default,
  'centrifuge chain': _centrifuge.default,
  'Centrifuge Chain Node': _centrifuge.default,
  'CESS Testnet': _cess.default,
  ChainOLI: _oli2.default,
  'ChainX Node': _chainx.default,
  'Clover Node': _clover.default,
  Coinversation: _coinversation2.default,
  'Competitors Club': _competitorsClub2.default,
  'Composable Finance': _composableFinance.default,
  'Crown Sterling': _crownSterling2.default,
  crust: _crust.default,
  'Crust Collator': _crust.default,
  'Crust Maxwell': _crustMaxwell.default,
  'Crust Testnet': _crustParachain.default,
  'DAO IPCI': _ipci.default,
  darwinia: _darwinia.default,
  'darwinia crab': _crab.default,
  'darwinia parachain': _darwinia.default,
  'Darwinia Runtime Module Library': _darwinia.default,
  DataHighway: _datahighway2.default,
  'DataHighway Node': _datahighway2.default,
  'DataHighway Parachain Collator': _datahighway2.default,
  'DataHighway Spreehafen Rococo Parachain Testnet': _datahighway.default,
  'DataHighway Tanganika Kusama Parachain': _tanganika.default,
  'Dock Full Node': _dockMainnet.default,
  'Dock Node': _dockMainnet.default,
  'Dora Factory': _dorafactory.default,
  'DOTMog Node': _dotmog.default,
  'Eave Node': _eave.default,
  'Edgeware Node': _edgewareWhite.default,
  Efinity: _efinity2.default,
  'Efinity Node': _efinity2.default,
  'Encointer collator': _encointerBlue.default,
  'Encointer Node noTEE': _encointerBlue.default,
  'Fantour Node': _fantour.default,
  'Galital Parachain Collator': _galitalLogo.default,
  'GamePower Node': _gamepower.default,
  GEEK: _geek.default,
  Geminis: _geminis.default,
  'GM Collator': _gm.default,
  'Halongbay Parachain Collator': _polkafoundry.default,
  hanonycash: _hanonycash.default,
  Helixstreet: _helixstreet.default,
  'Idavoll Node': _idavoll.default,
  'Imbue Node': _imbue.default,
  'Integritee Collator': _integritee.default,
  'Integritee Node': _integritee.default,
  Interlay: _interlay.default,
  'InvArch Brainstorm Node': _brainstorm.default,
  'InvArch Tinkernet Node': _tinker.default,
  IpseTestnet: _ipse.default,
  'Jaz Node': _jaz.default,
  'Joystream Node': _joystream.default,
  Kabocha: _kabocha2.default,
  'Kabocha (kabsoup)': _kabocha2.default,
  Kerria: _parallel2.default,
  'Kerria Dev': _parallel2.default,
  Khala: _khala.default,
  'Khala Node': _khala.default,
  KICO: _kico.default,
  KILT: _kilt.default,
  'KILT Local': _kilt.default,
  'KILT Peregrine': _kilt.default,
  Kintsugi: _kintsugi.default,
  'Klug Dossier Node': _klug.default,
  'Kpron Collator': _apron.default,
  kulupu: _kulupu.default,
  kusari: _kusari.default,
  'Kylin Node': _kylin.default,
  'Laminar Node': _laminarCircle.default,
  'Listen Network': _listen.default,
  'Litentry node': _litentry.default,
  'logion Collator': _logion.default,
  'Logion Node': _logion.default,
  'mandala node': _acala.default,
  'Manta Node': _manta.default,
  'Manta Parachain Collator': _manta.default,
  MathChain: _math.default,
  'mathChain-galois': _math.default,
  'MD5 Network': _md.default,
  minix: _minix.default,
  Moonrock: _moonrock.default,
  'Moonsama Development': _moonsama.default,
  'mybank.network': _mybank.default,
  NFTMart: _nftmart.default,
  'NFTMart Staging': _nftmart.default,
  'NFTMart Testnet': _nftmart.default,
  'node-template': _substrateHexagon.default,
  'Nodle Chain Node': _nodle.default,
  OmniBTC: _omnibtc2.default,
  'Opal Node': _opalLogo2.default,
  'Opportunity Standalone Testnet': _opportunity.default,
  Pangolin: _pangolin.default,
  Pangoro: _pangoro.default,
  Parallel: _parallel2.default,
  'Parallel Dev': _parallel2.default,
  'Parallel Heiko': _parallel2.default,
  'Parallel Heiko Dev': _parallel2.default,
  Parami: _parami.default,
  'parity-polkadot': _polkadotCircle.default,
  'Patract Node': _jupiter.default,
  Phala: _phala.default,
  phala: _phala.default,
  'Phala Collator': _phala.default,
  'phala-substrate-node': _phala.default,
  'PHOENIX Collator': _phoenix.default,
  'PHOENIX Node': _phoenix.default,
  'Pichiu Node': _pichiu.default,
  'Pioneer Network Collator Node': _pioneer.default,
  'Polkadex Node': _polkadex.default,
  'polkadot-js': _polkadotJs2.default,
  'PolkaFoundry Node': _polkafoundry.default,
  'PolkaFoundry Parachain Collator': _polkafoundry.default,
  'PolkaSmith Parachain Collator': _polkasmith.default,
  'Pontem Testnet': _pontem.default,
  'Prism Collator': _prism.default,
  'Prism Node': _prism.default,
  'Quartz Node': _quartz2.default,
  'ReAlis Network': _realis.default,
  'Rio Defi Chain Node': _riochain.default,
  'RioChain Staging': _riochain.default,
  robonomics: _robonomics.default,
  Rocfinity: _rocfinity2.default,
  Sakura: _sakura.default,
  Shadow: _shadow.default,
  sherpax: _sherpax.default,
  'Shiden Collator': _shiden.default,
  'SingLavender Parachain Collator': _singlavender.default,
  Snow: _snow.default,
  Sora: _soraSubstrate.default,
  Stafi: _stafi.default,
  'Stafi Node': _stafi.default,
  'Statemine Collator': _statemine.default,
  'Statemint Collator': _statemine.default,
  subdao: _subdao.default,
  'SubDAO Collator': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  subspace: _subspace.default,
  'substrate-contracts-node': _substrateContractsNode.default,
  'substrate-node': _substrateHexagon.default,
  'subzero node': _zero.default,
  swapdex: _swapdex.default,
  t0rn: _t0rn.default,
  'Ternoa Node': _ternoa.default,
  'Totem Parachain Collator': _totem.default,
  'TrustBase Collator': _trustbase.default,
  'TrustBase Node': _trustbase.default,
  'uni arts node': _uniarts.default,
  'UniArts Node': _uniarts.default,
  'Unique Node': _unique2.default,
  'Unit Collator': _unitv.default,
  'Unit Node': _unitv.default,
  Vanilla: _parallel2.default,
  'Vanilla Dev': _parallel2.default,
  Vln: _valiu.default,
  'VLN PC': _valiu.default,
  'Web3Games Node': _web3games.default,
  Westend: _westend_colour.default,
  Westlake: _westlake.default,
  'Westmint Collator': _statemine.default,
  Whala: _whala.default,
  'Whala Node': _whala.default,
  WILT: _kilt.default,
  'zcloak node': _zCloak.default,
  'Zeitgeist Collator': _zeitgeist.default,
  'Zeitgeist Node': _zeitgeist.default,
  Zenlink: _zenlink.default,
  'Zenlink Collator': _zenlink.default
}).reduce((logos, _ref2) => {
  let [node, logo] = _ref2;
  return {
    ...logos,
    [(0, _util.sanitize)(node)]: logo
  };
}, {});

// Alphabetical overrides based on the actual specName
exports.nodeLogos = nodeLogos;
const specLogos = Object.entries({
  oak: _oak.default,
  shell: _shell.default,
  statemine: _statemine.default,
  statemint: _statemine.default,
  turing: _turing.default,
  westmint: _statemine.default
}).reduce((logos, _ref3) => {
  let [spec, logo] = _ref3;
  return {
    ...logos,
    [(0, _util.sanitize)(spec)]: logo
  };
}, {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
exports.specLogos = specLogos;
const namedLogos = {
  acala: _acala.default,
  ajuna: _ajuna.default,
  aleph: _aleph.default,
  alexander: _polkadotCircle.default,
  altair: _altair.default,
  amplitude: _amplitude.default,
  arctic: _arctic.default,
  'Ares Gladios': _aresGladios.default,
  'Ares Odyssey': _aresOdyssey.default,
  astar: _astar.default,
  automata: _automata.default,
  'automata-contextfree': _automata.default,
  aventus: _aventus.default,
  bajun: _bajun.default,
  basilisk: _basilisk.default,
  beast: _beast.default,
  bifrost: _bifrost.default,
  'Bifrost Stage Testnet': _bifrost.default,
  bitcountry: _bitcountry.default,
  bitcountryPioneer: _pioneer.default,
  bitgreen: _bitgreen.default,
  brainstorm: _brainstorm.default,
  calamari: _calamari.default,
  centrifuge: _centrifuge.default,
  cess: _cess.default,
  chainoli: _oli2.default,
  chainx: _chainx.default,
  charcoal: _centrifuge.default,
  clover: _clover.default,
  coinversation: _coinversation.default,
  'competitors-club': _competitorsClub.default,
  composableFinance: _composableFinance.default,
  crab: _crab.default,
  creditcoin: _creditcoin.default,
  'creditcoin-testnet': _creditcoinTest.default,
  'crown-sterling': _crownSterling.default,
  crust: _crust.default,
  'Crust Maxwell': _crustMaxwell.default,
  'Crust Testnet': _crustParachain.default,
  crustParachain: _crust.default,
  'crust-rocky': _rocky.default,
  'Dali Testnet (Rococo Relay)': _dali.default,
  DaliTestnet: _dali2.default,
  darwinia: _darwinia.default,
  datahighway: _datahighway2.default,
  'dock-pos-mainnet': _dockMainnet.default,
  'dock-pos-testnet': _dockTestnet.default,
  dolphin: _dolphin.default,
  dorafactory: _dorafactory.default,
  dotmog: _dotmog.default,
  eave: _eave.default,
  edgeware: _edgewareWhite.default,
  efinity: _efinity2.default,
  Eggnet: _webb.default,
  empty: _empty.default,
  encointer: _encointerBlue.default,
  equilibrium: _equilibrium.default,
  fantour: _fantour.default,
  galital: _galitalLogo.default,
  galois: _math.default,
  gamepower: _gamepower.default,
  geek: _geek.default,
  geminis: _geminis.default,
  genshiro: _genshiro.default,
  gm: _gm.default,
  halongbay: _polkafoundry.default,
  hanonycash: _hanonycash.default,
  heiko: _parallel.default,
  helixstreet: _helixstreet.default,
  hydra: _snakenet.default,
  idavoll: _idavoll.default,
  imbue: _imbue.default,
  integritee: _integritee.default,
  interlay: _interlay.default,
  'interlay-testnet': _interlay.default,
  ipci: _ipci.default,
  ipse: _ipse.default,
  jaz: _jaz.default,
  joystream: _joystream.default,
  jupiter: _jupiter.default,
  kabocha: _kabocha2.default,
  'Kabocha (kabsoup)': _kabocha2.default,
  kapex: _totem.default,
  karura: _karura.default,
  kerria: _parallel2.default,
  khala: _khala.default,
  kico: _kico.default,
  kilt: _kilt.default,
  kintsugi: _kintsugi.default,
  'kintsugi-testnet': _kintsugi.default,
  klugdossier: _klug.default,
  kpron: _apron.default,
  kulupu: _kulupu.default,
  kusama: _kusama.default,
  kusari: _kusari.default,
  kylin: _kylin.default,
  laminar: _laminarCircle.default,
  listen: _listen.default,
  litentry: _litentry.default,
  litmus: _litmus.default,
  logion: _logion.default,
  loomNetwork: _loom_network.default,
  mangata: _mangatax.default,
  manta: _manta.default,
  mars: _aresMars.default,
  mathchain: _math.default,
  minix: _minix.default,
  moonbaseAlpha: _moonbase_alpha.default,
  moonbeam: _moonbeam.default,
  moonriver: _moonriver.default,
  moonrock: _moonrock.default,
  moonshadow: _moonshadow.default,
  mybank: _mybank.default,
  myriad: _myriad.default,
  nftmart: _nftmart.default,
  nodle: _nodle.default,
  oak: _oak.default,
  odyssey: _aresOdyssey.default,
  omnibtc: _omnibtc2.default,
  opal: _opalLogo2.default,
  opportunity: _opportunity.default,
  'origintrail-parachain': _origintrail.default,
  pangolin: _pangolin.default,
  pangoro: _pangoro.default,
  parallel: _parallel.default,
  phala: _phala.default,
  phoenix: _phoenix.default,
  picasso: _picasso.default,
  pichiu: _pichiu.default,
  polkadex: _polkadex.default,
  polkadot: _polkadotCircle.default,
  polkafoundry: _polkafoundry.default,
  polkasmith: _polkasmith.default,
  polymesh: _polymesh.default,
  pontem: _pontem.default,
  prism: _prism.default,
  quartz: _quartz2.default,
  realis: _realis.default,
  riochain: _riochain.default,
  robonomics: _robonomics.default,
  rocfinity: _rocfinity2.default,
  rocky: _crust.default,
  rococo: _rococo.default,
  rococoAcala: _acala.default,
  rococoAmplitude: _amplitude.default,
  rococoApron: _apron.default,
  rococoAres: _ares.default,
  rococoAventus: _aventus2.default,
  rococoBajun: _bajun.default,
  rococoBasilisk: _basilisk.default,
  rococoBifrost: _bifrost.default,
  rococoBitCountry: _bitcountry.default,
  rococoBitgreen: _bitgreen.default,
  rococoCatalyst: _centrifuge.default,
  rococoChainX: _chainx.default,
  rococoClover: _clover.default,
  rococoConfti: _confti.default,
  rococoContracts: _rococoContracts.default,
  rococoCrab: _crab.default,
  rococoCrust: _crust.default,
  rococoDali: _dali.default,
  rococoDarwinia: _darwinia.default,
  rococoDolphin: _dolphin.default,
  rococoEave: _eave.default,
  rococoEncointer: _encointerBlue.default,
  rococoFrequency: _frequencyRococo.default,
  rococoGalital: _galitalLogo.default,
  rococoGenshiro: _genshiro.default,
  rococoHelixstreet: _helixstreet.default,
  rococoHydraDX: _hydrate.default,
  rococoIdavoll: _idavoll.default,
  rococoImbue: _imbue.default,
  rococoIntegritee: _integritee.default,
  rococoInterBTC: _interlay.default,
  rococoJupiter: _jupiter.default,
  rococoKabocha: _kabocha2.default,
  rococoKilt: _kilt.default,
  rococoKonomi: _konomi.default,
  rococoKylin: _kylin.default,
  rococoLaminar: _laminarCircle.default,
  rococoLitentry: _litentry.default,
  rococoLoomNetwork: _loom_network.default,
  rococoMangata: _mangatax.default,
  rococoManta: _manta.default,
  rococoMathChain: _math.default,
  rococoMd5: _md.default,
  rococoMoonrock: _moonrock.default,
  rococoMoonsama: _moonsama.default,
  rococoNodle: _nodle.default,
  rococoOriginTrailParachain: _origintrailTestnet.default,
  rococoPangolin: _pangolin.default,
  rococoParami: _parami.default,
  rococoPhala: _phala.default,
  rococoPhoenix: _phoenix.default,
  rococoPolkaFoundry: _polkafoundry.default,
  rococoPrism: _prism.default,
  rococoSingLavender: _singlavender.default,
  rococoSora: _soraSubstrate.default,
  rococoSpreehafen: _datahighway.default,
  rococoStandard: _standard.default,
  rococoStatemint: _statemine.default,
  rococoSubDAO: _subdao.default,
  rococoSubsocial: _soonsocialX.default,
  rococoSubzero: _zero.default,
  rococoTick: _rococoTick.default,
  rococoTinkernet: _tinker.default,
  rococoTrack: _rococoTrack.default,
  rococoTrick: _rococoTrick.default,
  rococoTrustBase: _trustbase.default,
  rococoTuring: _turing.default,
  rococoUnitv: _unitv.default,
  rococoVirto: _virto.default,
  rococoVln: _valiu.default,
  rococoWatr: _watr.default,
  rococoZeitgeist: _zeitgeist.default,
  rococoZenlink: _zenlink.default,
  sakura: _sakura.default,
  shadow: _shadow.default,
  shell: _shell.default,
  sherpax: _sherpax.default,
  shibuya: _shiden.default,
  shiden: _shiden.default,
  singLavender: _singlavender.default,
  skyekiwi: _skyekiwi.default,
  snakenet: _snakenet.default,
  snow: _snow.default,
  snowbridge: _snowbridge.default,
  soonsocial: _soonsocial.default,
  sora: _soraSubstrate.default,
  'sora-substrate': _soraSubstrate.default,
  sora_ksm: _soraSubstrate.default,
  spanner: _spanner.default,
  stafi: _stafi.default,
  stagex: _totem.default,
  statemine: _statemine.default,
  statemint: _statemine.default,
  subdao: _subdao.default,
  'SubDAO PC1': _subdao.default,
  'SubDAO Staging': _subdao.default,
  subgame: _subgame.default,
  'SubGame Gamma': _subgame.default,
  'SubGame Staging': _subgame.default,
  subsocial: _subsocial.default,
  subsocialX: _subsocialX.default,
  subspace: _subspace.default,
  'subspace-farmnet': _subspace.default,
  'subspace-gemini-1': _subspace.default,
  'subspace-gemini-2a': _subspace.default,
  substrate: _substrateHexagon.default,
  substrateContractsNode: _substrateContractsNode.default,
  swapdex: _swapdex.default,
  t0rn: _t0rn.default,
  tanganika: _tanganika.default,
  ternoa: _ternoa.default,
  'ternoa-alphanet': _ternoa.default,
  'ternoa-testnet': _ternoa.default,
  tinker: _tinker.default,
  'totem-parachain': _totem.default,
  trustbase: _trustbase.default,
  turing: _turing.default,
  uniarts: _uniarts.default,
  unique: _unique2.default,
  unitv: _unitv.default,
  unorthodox: _unorthodox.default,
  vanilla: _parallel2.default,
  vara: _vara2.default,
  vln: _valiu.default,
  web3games: _web3games.default,
  westend: _westend_colour.default,
  westendCollectives: _westendCollectives.default,
  westendPichiu: _pichiu.default,
  westendStandard: _standard.default,
  westlake: _westlake.default,
  westmint: _statemine.default,
  whala: _whala.default,
  zCloak: _zCloak.default,
  zeitgeist: _zeitgeist.default,
  zero: _zero.default
};

// extension logos
exports.namedLogos = namedLogos;
const extensionLogos = {
  'polkadot-js': _polkadotJs.default
};

// external logos, i.e. for explorers
exports.extensionLogos = extensionLogos;
const externalLogos = {
  commonwealth: _commonwealth.default,
  dotreasury: _dotreasury.default,
  dotscanner: _dotscanner.default,
  kodadot: _kodadot.default,
  polkaholic: _polkaholic.default,
  polkascan: _polkascan.default,
  polkassembly: _polkassembly.default,
  polkastats: _polkastats.default,
  singular: _singular.default,
  statescan: _statescan.default,
  subid: _subid.default,
  subscan: _subscan.default,
  subsquare: _subsquare.default
};

// empty logos
exports.externalLogos = externalLogos;
const emptyLogos = {
  empty: _empty.default
};

// preload all
exports.emptyLogos = emptyLogos;
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].forEach(imageSet => {
  Object.values(imageSet).forEach(src => {
    new Image().src = src;
  });
});