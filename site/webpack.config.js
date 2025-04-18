const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// File merge plugin we will need below to combine two files
class FileMergeWebpackPlugin {
  constructor({ files, destination, removeSourceFiles }) {
    this.files = files;
    this.destination = destination;
    this.removeSourceFiles = removeSourceFiles;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('FileMergeWebpackPlugin', () => {
      const fileBuffers = [];

      this.files
        .filter((file) => fs.existsSync(file))
        .forEach((file) => fileBuffers.push(fs.readFileSync(file)));

      const dir = path.dirname(this.destination);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.destination, Buffer.concat(fileBuffers), {
        encoding: 'UTF-8',
      });

      if (this.removeSourceFiles) {
        this.files.forEach((file) => fs.unlinkSync(file));
      }
    });
  }
}

const widgetSrcDir = './src/js/widgets';
//Make sure this value matches the 'Class' section of the config.json of your widgets
//If jsClientName is 'MyNamespace' then your 'Class' should be 'MyNamespace.Widgets'
const jsClientName = 'Client'; //[ClientName].Widgets.WidgetName
const useTypeScript = true;

const isProduction = process.env.NODE_ENV === 'prod';

// Copy language files
//const languageList = ["de-de", "el-gr", "en-us", "es-es", "fr-fr", "it-it", "nl-be", "nl-nl", "pl-pl", "pt-br", "pt-pt", "tr-tr", "zh-cn"];
const languageList = ['en-us'];
const languageCopyConfig = languageList.flatMap((language) => [
  {
    source: path.join(__dirname, `src/js/library/language/${language}.js`),
    destination: path.join(
      __dirname,
      `build/sitedefinitions/Client/CDNAssets/content/language/${language}.js`
    ),
  },
  //{
  //  source: path.join(__dirname, `src/js/library/language/foundation-${language}.js`),
  //  destination: path.join(__dirname, `build/sitedefinitions/Client/CDNAssets/content/language/foundation-${language}.js`),
  //},
  {
    source: path.join(__dirname, `src/js/library/language/${language}.js`),
    destination: path.join(
      __dirname,
      `build/sitedefinitions/Client/branding/content/language/${language}.js`
    ),
  },
  //{
  //  source: path.join(__dirname, `src/js/library/language/foundation-${language}.js`),
  //  destination: path.join(__dirname, `build/sitedefinitions/Client/branding/content/language/foundation-${language}.js`),
  //},
]);

/**
 * Generates the Webpack configuration for a specific widget, determining whether to use TypeScript
 * based on the existence of the corresponding TypeScript file.
 *
 * @param {string} widgetName - The name of the widget to generate configuration for.
 * @returns {object} - The Webpack configuration object for the specified widget.
 */
var genWidgetsConfig = function (widgetName) {
  var ext = '.js';
  var useTypeScriptForWidget = useTypeScript;
  try {
    if (useTypeScript) {
      var tsFilePath = path.resolve(
        __dirname,
        widgetSrcDir + '/' + widgetName + '/js/widgets/' + widgetName + '.ts'
      );
      if (fs.existsSync(tsFilePath)) {
        console.log('Using TypeScript for ' + widgetName);
        ext = '.ts';
      } else {
        useTypeScriptForWidget = false;
      }
    }
  } catch (err) {
    console.error(err);
  }

  var extOut = '.js';
  var o = {
    filename: widgetName + extOut,
    path: path.resolve(__dirname, 'dist/widgets'),
    library: [jsClientName, 'Widgets', widgetName],
    libraryTarget: 'var',
  };
  if (useTypeScriptForWidget) {
    o.libraryExport = widgetName;
  }

  return {
    name: 'core',
    mode: isProduction ? 'production' : 'development',
    entry: widgetSrcDir + '/' + widgetName + '/js/widgets/' + widgetName + ext,
    output: o,
    externals: {
      'akumina-core': 'Akumina',
      jquery: 'jQuery',
      Akumina: 'Akumina',
    },
    resolve: {
      extensions: ['.ts'],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Akumina: 'Akumina',
      }),
    ],
    module: {
      rules: [{ test: /\.ts?$/, loader: 'ts-loader' }],
    },
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: true,
                mangle: true,
              },
            }),
          ],
        }
      : {},
  };
};

/**
 * Generates Webpack configuration for our code + all widgets in the source directory.
 *
 * @returns {Array} - An array of Webpack configuration objects
 */
module.exports = function () {
  var webpackConfigs = [];

  // Add the main JS configuration + other file copies
  webpackConfigs.push(
    // This packs a set of code that needs to happen before the page loads and thus needs a separate configuration
    {
      name: 'BeforePageLoad',
      entry: {
        beforePageLoad: './src/js/library/BeforePageLoad.js',
      },
      output: {
        filename: 'BeforePageLoad.js',
        path: path.resolve(__dirname, 'dist/js/'),
        iife: false, // Don't wrap this code in anything
      },
      mode: isProduction ? 'production' : 'development',
      devtool: false,
      optimization: isProduction
        ? {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  compress: true,
                  mangle: true,
                },
              }),
            ],
          }
        : {},
    },
    // This packs the main digitalworkplace.custom.js file and anything in it that executes at runtime
    {
      name: 'DigitalWorkplaceCustom',
      dependencies: ['BeforePageLoad'],
      entry: './src/js/library/digitalworkplace.custom.js',
      output: {
        filename: 'digitalworkplace.custom.js',
        path: path.resolve(__dirname, 'dist/js/'),
      },
      mode: isProduction ? 'production' : 'development',
      devtool: false,
      resolve: {
        extensions: ['.ts', '.js'], // Ensure proper extensions are resolved
      },
      optimization: isProduction
        ? {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  compress: true,
                  mangle: true,
                },
              }),
            ],
          }
        : {},
      plugins: [
        // This combines the generated JS files together into one since that's all Akumina gives us
        new FileMergeWebpackPlugin({
          destination:
            'build/sitedefinitions/Client/CDNAssets/js/digitalworkplace.custom.js',
          removeSourceFiles: true,
          files: [
            'dist/js/BeforePageLoad.js',
            'dist/js/digitalworkplace.custom.js',
          ],
        }),
        new FileManagerPlugin({
          events: {
            onEnd: {
              copy: [
                // Copy JS to a secondary location
                {
                  source: path.join(
                    __dirname,
                    'build/sitedefinitions/Client/CDNAssets/js/'
                  ),
                  destination: path.join(
                    __dirname,
                    'build/sitedefinitions/Client/Branding/js/'
                  ),
                },
                // Copy Master Page
                {
                  source: path.join(__dirname, 'src/MasterPage/'),
                  destination: path.join(
                    __dirname,
                    'build/sitedefinitions/Client/CDNAssets/Content/Templates/MasterPage/'
                  ),
                },
                // Copy content templates
                {
                  source: path.join(__dirname, 'src/content/'),
                  destination: path.join(
                    __dirname,
                    'build/sitedefinitions/Client/CDNAssets/'
                  ),
                },
                // Copy language files
                ...languageCopyConfig,
              ],
            },
          },
        }),
      ],
    }
  );

  // CSS
  webpackConfigs.push({
    entry: './src/css/digitalworkplace.custom.css',
    output: {
      path: path.resolve(
        __dirname,
        'build/sitedefinitions/Client/CDNAssets/css/'
      ),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: false,
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'digitalworkplace.custom.css',
      }),
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              // Copy CSS to a secondary location
              {
                source: path.join(
                  __dirname,
                  'build/sitedefinitions/Client/CDNAssets/css/'
                ),
                destination: path.join(
                  __dirname,
                  'build/sitedefinitions/Client/Branding/css/'
                ),
              },
              // Copy Theme CSS
              {
                source: path.join(__dirname, 'src/css/themes/'),
                destination: path.join(
                  __dirname,
                  'build/sitedefinitions/Client/CDNAssets/css/themes/'
                ),
              },
            ],
          },
        },
      }),
    ],
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [new CssMinimizerPlugin()],
        }
      : {},
  });

  // Add in the widget configs
  fs.readdirSync(widgetSrcDir).forEach(function (file) {
    if (file.indexOf('.') == -1) {
      webpackConfigs.push(genWidgetsConfig(file));
    }
  });
  return webpackConfigs;
};
