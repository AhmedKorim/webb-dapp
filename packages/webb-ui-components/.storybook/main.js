
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'),
CssMinimizerPlugin = require('css-minimizer-webpack-plugin'),
HtmlWebPackPlugin = require('html-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
// const spawn = require('child_process').spawn;
// const CreateFileWebpack = require('create-file-webpack');
// const polkadotBabelWebpackConfig = require('@polkadot/dev/config/babel-config-webpack.cjs');

// const tsLoader = {
//   loader: 'ts-loader',
//   options: {
//     configFile: '../tsconfig.json',
//     transpileOnly: true,
//     happyPackMode: true,
//     onlyCompileBundledFiles: true,
//     experimentalFileCaching: true,
//     compilerOptions: {
//       module: 'esnext',
//     },
//   }
// };

module.exports = {
  experiments: {
    asyncWebAssembly: true,
  },
  framework: "@storybook/react",
  // entry: ['@babel/polyfill', './src/index.tsx'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: ['@storybook/addon-links','@storybook/addon-essentials', '@storybook/addon-interactions'],
  webpackFinal: (config) => {
    const extraRules = [
       // js stuffs
       {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: '3',
                  targets: {
                    browsers: ['last 2 versions', 'not ie <= 8'],
                    node: 'current',
                  },
                },
              ],
              '@babel/preset-typescript',
              ['@babel/preset-react', { development: isDevelopment }],
            ],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel'),
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
              'preval',
            ].filter(Boolean),
          },
        },
      },

      // css stuffs
      {
        test: /\.s?[ac]ss$/i,
        use: [
          isDevelopment
            ? 'style-loader'
            : {
                // save the css to external file
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: false,
                },
              },
          {
            // becombine other css files into one
            // https://www.npmjs.com/package/css-loader
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 2, // 2 other loaders used first, postcss-loader and sass-loader
              sourceMap: isDevelopment,
            },
          },
          {
            // process tailwind stuff
            // https://webpack.js.org/loaders/postcss-loader/
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  // add addtional postcss plugins here
                  // easily find plugins at https://www.postcss.parts/
                ],
              },
            },
          },
          {
            // load sass files into css files
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },

      // markdown
      {
        test: /\.md$/,
        use: [require.resolve('html-loader'), require.resolve('markdown-loader')],
      },

      // assets
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: [/semantic-ui-css/],
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash:8][ext]',
        },
      },

      // fonts
      {
        test: /\.(ttf|eot|otf|woff)$/,
        exclude: [/semantic-ui-css/],
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash:8][ext]',
        },
      },

      // icon
      {
        test: /\.(ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name][ext]',
          esModule: false,
        },
      },

      // assets
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.eot$/, /\.ttf$/, /\.woff$/, /\.woff2$/],
        include: [/semantic-ui-css/],
        use: [
          {
            loader: require.resolve('null-loader'),
          },
        ],
      },
      // svg react generator
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack', 'file-loader'],
      },
    ];

    config.module.rules = [...config.module.rules, ...extraRules];

    config.resolve.alias = {
      ...config.resolve.alias,
      '@webb-dapp/webb-ui-components/components': path.resolve(__dirname, '..', `../src/components`),
    };
    config.resolve.plugins = [
      // // build html file
      // new HtmlWebPackPlugin({
      //   template: './public/index.html',
      //   inject: true,
      //   filename: './preview-head.html',
      // }),

      //  // https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
      //  new CssMinimizerPlugin({
      //   // style do anything to the wordpress style.css file
      //   exclude: /style\.css$/,

      //   // Use multi-process parallel running to improve the build speed
      //   parallel: true,

      //   minimizerOptions: {
      //     preset: ['default', { discardComments: { removeAll: true } }],
      //     // plugins: ['autoprefixer'],
      //   },
      // }),
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ];
    return config;
  },
};
