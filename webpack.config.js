const fs = require('fs');
const getPort = require('get-port');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlInlineCssWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const paths = require('./scripts/config');

const mode = process.env.NODE_ENV;
const isDevelopment = mode === 'development';
const isProduction = !isDevelopment;

module.exports = async () => {
  const pages = fs.readdirSync(paths.src.pages)
    .filter(file => !file.startsWith('_'))
    .map(file => ({
      filename: file.replace('.pug', '.html'),
      template: `${paths.src.pages}/${file}`
    }));

  const port = await getPort({ port: getPort.makeRange(3000, 3100) });

  const config = {
    devServer: {
      port,
      // quiet: true
    },

    devtool: isProduction ? false : 'cheap-module-source-map',

    mode,

    entry: {
      bundle: path.resolve(paths.src.root, 'index.ts')
    },

    output: {
      path: path.join(__dirname, paths.distPath),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:16].js',
      chunkFilename: isDevelopment ? '[name].js' : '[name].[contenthash:16].js'
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [{
        test: /\.js?$/,
        use: [
          'cache-loader',
          'babel-loader',
          'eslint-loader'
        ]
      }, {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }, {
            loader: 'cache-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
          }, {
            loader: 'resolve-url-loader'
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /\.(png|jpe?g)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:16].[ext]',
              outputPath: 'images'
            }
          }
        ]
      }, {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:16].[ext]',
              outputPath: 'fonts'
            }
          }
        ]
      }, {
        test: /\.pug$/i,
        use: 'pug-loader'
      }, {
        test: /\.svg$/i,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'icons.[hash:16].svg'
        }
      }]
    },

    optimization: {},

    plugins: [
      new FaviconsWebpackPlugin({
        logo: './src/assets/img/logo.svg',
        favicons: {
          icons: {
            android: false,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            windows: false,
            yandex: false
          }
        },
        prefix: ''
      }),

      new ForkTsCheckerWebpackPlugin({
        async: !isProduction
      }),

      // new FriendlyErrorsWebpackPlugin({
      //   compilationSuccessInfo: {
      //     messages: [`You application is running here http://localhost:${port}`],
      //   }
      // }),

      ...pages.map(page => new HtmlWebpackPlugin(page)),

      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[contenthash:16].css',
        chunkFilename: isDevelopment ? '[name].css' : '[name].[contenthash:16].css'
      }),

      new PreloadWebpackPlugin({
        include: 'initial',
        fileWhitelist: [/.(js)$/]
      }),

      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),

      new SpriteLoaderPlugin({
        plainSprite: true
      })
    ],
  };

  if (isProduction) {
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(new CssoWebpackPlugin());
    config.plugins.push(new HtmlInlineCssWebpackPlugin());
    config.plugins.push(new OptimizeCssAssetsPlugin());
    config.plugins.push(new WorkboxPlugin.GenerateSW({
      exclude: [/\.(?:ico|png|jpg|jpeg|svg)$/],
      clientsClaim: true,
      skipWaiting: true
    }));

    // config.optimization.splitChunks = {
    //   chunks: 'all',
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor',
    //       chunks: 'all'
    //     }
    //   }
    // };
  }

  return config;
};
