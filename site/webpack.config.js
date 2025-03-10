var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var os = require('os');
var Terser = require('terser');
var CleanCSS = require('clean-css');

var widgetSrcDir = './src/js/widgets';
//Make sure this value matches the 'Class' section of the config.json of your widgets
//If jsClientName is 'MyNamespace' then your 'Class' should be 'MyNamespace.Widgets'
var jsClientName = 'Client'; //[ClientName].Widgets.WidgetName
var useTypeScript = true;

var isProduction = process.env.NODE_ENV === 'prod';

/**
 * Minifies JavaScript content using Terser.
 *
 * @param {string} content - The JavaScript content to minify.
 * @returns {string} The minified JavaScript content, or the original content if minification fails.
 */
function minifyJsContent(content) {
  let result = Terser.minify(content);
  if (result.error) {
    console.error('Terser minification error:', result.error);
    return content; // Return unminified content if minification fails
  }
  return result.code;
}

/**
 * Minifies CSS content using CleanCSS.
 *
 * @param {string} cssContent - The CSS content to minify.
 * @returns {string} The minified CSS content.
 */
function minifyCssContent(cssContent) {
  const minified = new CleanCSS().minify(cssContent);
  return minified.styles;
}

/**
 * Ensures that the directory structure for a given path exists.
 * Creates directories one by one if they do not exist.
 *
 * @param {string} dirPath - The directory path to ensure existence for.
 * @returns {void}
 */
function ensureDirectoryExistence(dirPath) {
  console.log('Created ' + dirPath);
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Copies a file from source to target. If the target is a directory, the file is copied into it with the same filename.
 * If the file is a JavaScript or CSS file and we are in production mode, it is minified before copying.
 *
 * @param {string} source - The source file path.
 * @param {string} target - The target file or directory path.
 * @returns {void}
 */
function copyFile(source, target) {
  var targetFile = target;

  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  // Ensure the target directory exists
  const targetDir = path.dirname(targetFile);
  ensureDirectoryExistence(targetDir);

  try {
    content = fs.readFileSync(source, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${source}: ${err.message}`);
    return;
  }

  if (isProduction && source.endsWith('.js')) {
    console.log(`Minifying and copying ${source} -> ${targetFile}`);
    content = minifyJsContent(content);
  } else if (isProduction && source.endsWith('.css')) {
    console.log(`Minifying and copying ${source} -> ${targetFile}`);
    content = minifyCssContent(content);
  } else {
    console.log(`Copying ${source} -> ${targetFile}`);
  }

  fs.writeFileSync(targetFile, content);
}

/**
 * Combines JS files in a folder into a single specified file. If the specified file already exists, appends
 * everything from the folder to it. Optionally minifies at the end.
 *
 * @param {string} source - The source folder path.
 * @param {string} base - The file to be used as a base for the others to be appended to.
 * @param {string} target - The target file or directory path.
 * @returns {void}
 */
function combineFolder(source, base) {
  if (!fs.existsSync(source) || !fs.lstatSync(source).isDirectory()) {
    throw new Error(
      `Source folder "${source}" does not exist or is not a directory.`
    );
  }

  // Create a temporary directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'combine-'));
  const tempFile = path.join(tempDir, path.basename(base));

  let combinedContent = '';
  combinedContent = fs.readFileSync(base, 'utf8');

  // Read and append all JS files from source folder
  const files = fs.readdirSync(source).filter((file) => file.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(source, file);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      combinedContent += `\n${fileContent}`;
      console.log(`Appending ${filePath} to ${base}`);
    } catch (err) {
      console.error(`Error reading file ${filePath}: ${err.message}`);
    }
  }

  // Write the combined content to the temporary file
  fs.writeFileSync(tempFile, combinedContent);
  console.log(`Temporary combined file created: ${tempFile}`);

  return tempFile;
}

/**
 * Recursively copies files and folders from source to target.
 * If directories exist in the source, they are created in the target and their contents are copied recursively.
 *
 * @param {string} source - The source directory path.
 * @param {string} target - The target directory path.
 * @returns {void}
 */
function copyFolderRecursively(source, target) {
  ensureDirectoryExistence(target);

  fs.readdirSync(source).forEach((file) => {
    const srcPath = path.join(source, file);
    const destPath = path.join(target, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderRecursively(srcPath, destPath); // Recurse into directories
    } else {
      copyFile(srcPath, destPath); // Copy files
    }
  });
}

// Copy individual files
copyFile(
  'src/css/digitalworkplace.custom.css',
  'build/sitedefinitions/Client/CDNAssets/css/digitalworkplace.custom.css'
);
copyFile(
  'src/css/digitalworkplace.custom.css',
  'build/sitedefinitions/Client/Branding/css/digitalworkplace.custom.css'
);
copyFile(
  'src/MasterPage/virtualmasterpagehivevisiblemenu.html',
  'build/sitedefinitions/Client/CDNAssets/Content/Templates/MasterPage/virtualmasterpagehivevisiblemenu.html'
);

// Create our digitalworkplace.custom.js
let digitalWorkplaceFile = combineFolder(
  'src/js/library/custom',
  'src/js/library/digitalworkplace.custom.js'
);
copyFile(
  digitalWorkplaceFile,
  'build/sitedefinitions/Client/CDNAssets/js/digitalworkplace.custom.js'
);
copyFile(
  digitalWorkplaceFile,
  'build/sitedefinitions/Client/Branding/js/digitalworkplace.custom.js'
);

// Copy language files
//var languageList = ["de-de", "el-gr", "en-us", "es-es", "fr-fr", "it-it", "nl-be", "nl-nl", "pl-pl", "pt-br", "pt-pt", "tr-tr", "zh-cn"];
var languageList = ['en-us'];
languageList.forEach((language) => {
  copyFile(
    `src/js/library/language/${language}.js`,
    `build/sitedefinitions/Client/CDNAssets/content/language/${language}.js`
  );
  copyFile(
    `src/js/library/language/foundation-${language}.js`,
    `build/sitedefinitions/Client/CDNAssets/content/language/foundation-${language}.js`
  );
  copyFile(
    `src/js/library/language/${language}.js`,
    `build/sitedefinitions/Client/branding/content/language/${language}.js`
  );
  copyFile(
    `src/js/library/language/foundation-${language}.js`,
    `build/sitedefinitions/Client/branding/content/language/foundation-${language}.js`
  );
});

// Copy content folders
copyFolderRecursively('src/content', 'build/sitedefinitions/Client/CDNAssets');

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
 * Generates Webpack configuration for all widgets in the source directory.
 *
 * @returns {Array} - An array of Webpack configuration objects for each widget found in the source directory.
 */
module.exports = function () {
  var widgetConfigArray = [];
  fs.readdirSync(widgetSrcDir).forEach(function (file) {
    if (file.indexOf('.') == -1) {
      widgetConfigArray.push(genWidgetsConfig(file));
    }
  });
  return widgetConfigArray;
};
