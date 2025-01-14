var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var widgetSrcDir = "./src/js/widgets";
//Make sure this value matches the 'Class' section of the config.json of your widgets
//If jsClientName is 'MyNamespace' then your 'Class' should be 'MyNamespace.Widgets'
var jsClientName = "Client"; //[ClientName].Widgets.WidgetName
var useTypeScript = true;

// file copy
function copyFileSync2( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    console.log('copying ' + targetFile + ' => ' + source);

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync2( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync2( curSource, targetFolder );
            } else {
                copyFileSync2( curSource, targetFolder );
            }
        } );
    }
}

// templates
if (!fs.existsSync('build/sitedefinitions/Client/CDNAssets/Content/Templates')){
    fs.mkdirSync('build/sitedefinitions/Client/CDNAssets/Content/Templates');
}
fs.copyFile('src/css/digitalworkplace.custom.css', 'build/sitedefinitions/Client/CDNAssets/css/digitalworkplace.custom.css', function (err) {
    if (err) {
        console.error("Unable to copy css file");
    }
});
fs.copyFile('src/css/digitalworkplace.custom.css', 'build/sitedefinitions/Client/Branding/CSS/digitalworkplace.custom.css', function (err) {
    if (err) {
        console.error("Unable to copy css file");
    }
});
fs.copyFile('src/js/library/digitalworkplace.custom.js', 'build/sitedefinitions/Client/CDNAssets/js/digitalworkplace.custom.js', function (err) {
    if (err) {
        console.error("Unable to copy digitalworkplace.custom.js file");
    }
});
if (!fs.existsSync('build/sitedefinitions/Client/CDNAssets/Content/Templates/MasterPage')){
    fs.mkdirSync('build/sitedefinitions/Client/CDNAssets/Content/Templates/MasterPage');
}
fs.copyFile('src/MasterPage/virtualmasterpagehivevisiblemenu.html', 'build/sitedefinitions/Client/CDNAssets/Content/Templates/MasterPage/virtualmasterpagehivevisiblemenu.html', function (err) {
    if (err) {
        console.error("Unable to copy master page file");
    }
});


var languageList = ["de-de","el-gr","en-us","es-es","fr-fr","it-it","nl-be","nl-nl","pl-pl","pt-br", "pt-pt","tr-tr","zh-cn"];
for (var i = 0; i < languageList.length; i++){
    var language = languageList[i];
    // copy to CDN
    fs.copyFile('src/js/library/language/' + language + '.js', 'build/sitedefinitions/Client/CDNAssets/content/language/' + language + '.js', function (err) {if (err) {console.error("Unable to copy " + language + ".js file");}});
    fs.copyFile('src/js/library/language/foundation-' + language + '.js', 'build/sitedefinitions/Client/CDNAssets/content/language/foundation-' + language + '.js', function (err) {if (err) {console.error("Unable to copy foundation-" + language + ".js file");}});
    // copy for SP
    fs.copyFile('src/js/library/language/' + language + '.js', 'build/sitedefinitions/Client/branding/content/language/' + language + '.js', function (err) {if (err) {console.error("Unable to copy " + language + ".js file");}});
    fs.copyFile('src/js/library/language/foundation-' + language + '.js', 'build/sitedefinitions/Client/branding/content/language/foundation-' + language + '.js', function (err) {if (err) {console.error("Unable to copy foundation-" + language + ".js file");}});
}

copyFolderRecursiveSync2('src/content', 'build/sitedefinitions/Client/CDNAssets');

var genWidgetsConfig = function (widgetName) {
    var ext = '.js';
    var useTypeScriptForWidget= useTypeScript;
    try {
        if (useTypeScript) {
            var tsFilePath = path.resolve(__dirname, widgetSrcDir + '/' + widgetName + '/js/widgets/' + widgetName + '.ts');
            if (fs.existsSync(tsFilePath)) {
                console.log('Using TypeScript for ' + widgetName);
                ext = '.ts';
            }
            else{
                useTypeScriptForWidget = false;
            }
        }
    } catch(err) {
        console.error(err)
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
        name: "core",
        // target: "node",
        entry: widgetSrcDir + '/' + widgetName + '/js/widgets/' + widgetName + ext,
        output: o,
        externals: {
            "akumina-core": "Akumina",
            "jquery": "jQuery",
            "Akumina": "Akumina"
        },
        resolve: {
            extensions: ['.ts']
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                Akumina: "Akumina"
            }),
        ],
        module: {
            rules: [
                { test: /\.ts?$/, loader: 'ts-loader' }
            ]
        }
    };

};

module.exports = function () {
    var widgetConfigArray = [];
    fs.readdirSync(widgetSrcDir).forEach(function (file) {
        if (file.indexOf('.') == -1) {
            widgetConfigArray.push(genWidgetsConfig(file));
        }
    });
    return widgetConfigArray;
};
