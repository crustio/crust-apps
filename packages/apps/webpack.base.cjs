// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const findPackages = require('../../scripts/findPackages.cjs');

function mapChunks (name, regs, inc) {
  return regs.reduce((result, test, index) => ({
    ...result,
    [`${name}${index}`]: {
      chunks: 'initial',
      enforce: true,
      name: `${name}.${`0${index + (inc || 0)}`.slice(-2)}`,
      test
    }
  }), {});
}

function createWebpack (context, mode = 'production') {
  const isProd = mode === 'production';
  const pkgJson = require(path.join(context, 'package.json'));
  const alias = findPackages().reduce((alias, { dir, name }) => {
    alias[name] = path.resolve(context, `../${dir}/src`);

    return alias;
  }, {
    './erasExposure.js': path.resolve(__dirname, 'src/patch/erasExposure.js'),
    './erasRewards.js': path.resolve(__dirname, 'src/patch/erasRewards.js'),
    './erasRewards.mjs': path.resolve(__dirname, 'src/patch/erasRewards.mjs'),
    './filterEras.mjs': path.resolve(__dirname, 'src/patch/filterEras.mjs'),
    './ownExposure.js': path.resolve(__dirname, 'src/patch/ownExposure.js'),
    './ownSlashes.js': path.resolve(__dirname, 'src/patch/ownSlashes.js'),
    './query.mjs': path.resolve(__dirname, 'src/patch/query.mjs'),
    './query.js': path.resolve(__dirname, 'src/patch/query.js'),
    './validators.js': path.resolve(__dirname, 'src/patch/validators.js'),
    './stakerRewards.js': path.resolve(__dirname, 'src/patch/stakerRewards.js'),
    './bundles/explore': path.resolve(__dirname, 'src/patch/bundles/explore'),
    './components/StartExploringPage': path.resolve(__dirname, 'src/patch/StartExploringPage'),
  });
  const plugins = fs.existsSync(path.join(context, 'public'))
    ? new CopyWebpackPlugin({ patterns: [{ from: 'public' }] })
    : [];

  return {
    context,
    entry: ['@babel/polyfill', './src/index.tsx'],
    mode,
    module: {
      rules: [
        {

          exclude: /(node_modules)/,
          test: /\.css$/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            }
          ]

        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            require.resolve('css-loader')
          ]
        },
        {
          exclude: /(node_modules)/,
          test: /\.(js|mjs|ts|tsx)$/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('@polkadot/dev/config/babel-config-webpack.cjs')
            }
          ]
        },
        {
          test: /\.md$/,
          use: [
            require.resolve('html-loader'),
            require.resolve('markdown-loader')
          ]
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                esModule: false,
                limit: 10000,
                name: 'static/[name].[contenthash:8].[ext]'
              }
            }
          ]
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.otf$/, /\.woff$/, /\.woff2$/],
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                esModule: false,
                name: 'static/[name].[contenthash:8].[ext]'
              }
            }
          ]
        },
        {
          include: [/semantic-ui-css/],
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          use: [
            {
              loader: require.resolve('null-loader')
            }
          ]
        }
      ]
    },
    node: {
      __dirname: false,
      __filename: false
    },
    optimization: {
      minimize: mode === 'production',
      splitChunks: {
        cacheGroups: {
          ...mapChunks('robohash', [
            /* 00 */ /RoboHash\/(backgrounds|sets\/set1)/,
            /* 01 */ /RoboHash\/sets\/set(2|3)/,
            /* 02 */ /RoboHash\/sets\/set(4|5)/
          ]),
          ...mapChunks('polkadot', [
            /* 00 */ /node_modules\/@polkadot\/(wasm)/,
            /* 01 */ /node_modules\/(@polkadot\/(api|metadata|rpc|types))/,
            /* 02 */ /node_modules\/(@polkadot\/(extension|keyring|networks|react|ui|util|vanitygen|x-)|@acala-network|@edgeware|@laminar|@ledgerhq|@open-web3|@sora-substrate|@subsocial|@zondax|edgeware)/
          ]),
          ...mapChunks('react', [
            /* 00 */ /node_modules\/(@fortawesome)/,
            /* 01 */ /node_modules\/(@emotion|@semantic-ui-react|@stardust|classnames|chart\.js|codeflask|copy-to-clipboard|file-selector|file-saver|hoist-non-react|i18next|jdenticon|keyboard-key|mini-create-react|popper\.js|prop-types|qrcode-generator|react|remark-parse|semantic-ui|styled-components)/
          ]),
          ...mapChunks('other', [
            /* 00 */ /node_modules\/(@babel|ansi-styles|asn1|browserify|buffer|history|html-parse|inherit|lodash|object|path-|parse-asn1|pbkdf2|process|public-encrypt|query-string|readable-stream|regenerator-runtime|repeat|rtcpeerconnection-shim|safe-buffer|stream-browserify|store|tslib|unified|unist-util|util|vfile|vm-browserify|webrtc-adapter|whatwg-fetch)/,
            /* 01 */ /node_modules\/(attr|brorand|camelcase|core|chalk|color|create|cuint|decode-uri|deep-equal|define-properties|detect-browser|es|event|evp|ext|function-bind|has-symbols|ieee754|ip|is|lru|markdown|minimalistic-|moment|next-tick|node-libs-browser|random|regexp|resolve|rxjs|scheduler|sdp|setimmediate|timers-browserify|trough)/,
            /* 03 */ /node_modules\/(base-x|base64-js|blakejs|bip|bn\.js|cipher-base|crypto|des\.js|diffie-hellman|elliptic|hash|hmac|js-sha3|md5|miller-rabin|ripemd160|secp256k1|scryptsy|sha\.js|xxhashjs)/
          ])
        }
      }
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[contenthash:8].js',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      path: path.join(context, 'build'),
      publicPath: ''
    },
    performance: {
      hints: false
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          VERSION: JSON.stringify(pkgJson.version),
          WS_URL: JSON.stringify(process.env.WS_URL),
          CRU_CLAIM_USER: JSON.stringify(process.env.CRU_CLAIM_USER),
          CRU_CLAIM_PASSWD: JSON.stringify(process.env.CRU_CLAIM_PASSWD),
          CSM_CLAIM_USER: JSON.stringify(process.env.CSM_CLAIM_USER),
          CSM_CLAIM_PASSWD: JSON.stringify(process.env.CSM_CLAIM_PASSWD),
          CSM_LOCKING_USER: JSON.stringify(process.env.CSM_LOCKING_USER),
          CSM_LOCKING_PASSWD: JSON.stringify(process.env.CSM_LOCKING_PASSWD),
          LUCKY_ORDER_USER: JSON.stringify(process.env.LUCKY_ORDER_USER),
          LUCKY_ORDER_PASSWD: JSON.stringify(process.env.LUCKY_ORDER_PASSWD),
        }
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    ].concat(plugins),
    resolve: {
      alias: {
        ...alias,
        'react/jsx-runtime': require.resolve('react/jsx-runtime')
      },
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        os: false,
        assert: false
      }
    }
  };
}

module.exports = createWebpack;
