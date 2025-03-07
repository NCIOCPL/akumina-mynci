var exeCute = require('exe');
const dotenv = require('dotenv');
const siteDeployerConfig = require('../akumina.siteDeployer.config.json');
dotenv.config();

/*-----------------------------------------------------------------
Whereas this file was previously edited, it is no longer
necessary to do so. One can just edit .env and siteDeployer.config.json
-----------------------------------------------------------------*/

const options = Object.entries(siteDeployerConfig.Options)
    .filter(([k, v]) => v == true).map(([k, v]) => k).toString()

const envParams = Object.entries(process.env).filter(([key, value]) =>
    siteDeployerConfig.Args.includes(key) && value != '').map(o =>
        `${o[0]} ${o[1]}`).join(' ')

try {
    console.log("Running:")
    console.log('.\\tools\\Akumina.SiteDeployer.exe options ' + options + ' ' + envParams)
    exeCute('.\\tools\\Akumina.SiteDeployer.exe options ' + options + ' ' + envParams);
} catch (ex) {
    console.error('Error executing the SiteDeployer.exe, check console');
    process.exit(1); // Ensures the script exits with failure
}