var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var siteDefinitionName = "Client";
var langSrcDir = "src/js/library/language";
var langDestDir = "build/sitedefinitions/" + siteDefinitionName + "/CDNAssets/content/templates/language";
/*
try {
  fs.readdirSync(langSrcDir).forEach(function (file) {
    fs.copyFile(langSrcDir + '/' + file, langDestDir + '/' + file, function (err) {
      if (err) {console.error("Unable to copy de-de.js file");}
      else {console.log("Copied " + langDestDir + '/' + file);}
    });
  });
} catch (ex) {
  console.error(ex);
}
*/
var jsFilesFramework = function (file) {
  return {
    entry: {"lang.js": [path.resolve(__dirname, langSrcDir + "/" + file)]},
    output: { filename:file, path: path.resolve(__dirname, langDestDir)}
  }
};

module.exports = function () {
  var langFileArray = [];
  fs.readdirSync(langSrcDir).forEach(function (file) {
    langFileArray.push(jsFilesFramework(file));
  });
  return langFileArray;
};