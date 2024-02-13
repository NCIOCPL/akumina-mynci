import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import AkuminaSite from './lib/akumina-site.js';
import DrupalContent from './lib/drupal-content.js';
import URLConverter from './lib/url-converter.js';
import DrupalUserlist from "./lib/drupal-userlist.js";
import AkuminaTaxonomyList from "./lib/akumina-taxonomy-list.js";

// Retrieve our secrets
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../.env` });

// Define our content export location
const drupalExports = {
  about: '../content/about.xml',
  announcements: '../content/announcements.xml',
  blogs: '../content/blogs.xml',
  coreContent: '../content/core-content.xml',
  events: '../content/events.xml',
  file: '../content/file.xml',
  forms: '../content/forms.xml',
  holidayEvents: '../content/holiday-events.xml',
  organizationDetails: '../content/organization-details.xml',
  policy: '../content/policy.xml',
};
// Define our taxonomy export location
const taxonomyJSON = {
  topics: '../content/taxonomy-topics.json',
};
// Set up the export data
let drupalExport = new DrupalContent();
await drupalExport.loadContent(drupalExports);
//Set up list of taxonomy terms and ids from sharepoint
let taxonomyList = new AkuminaTaxonomyList();
await taxonomyList.loadContent(taxonomyJSON);
//Create the map of old to new urls
let urlsConverted = new URLConverter();
let drupalUsers = new DrupalUserlist();
await urlsConverted.loadURLs(drupalExport.drupal.about,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.announcements,'Path','/FoundationNews/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.blogs,'Path','/Blogs/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.coreContent,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.events,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.file,'Path','/myNCI-preprod/Shared%20Documents/');
await urlsConverted.loadURLs(drupalExport.drupal.file,'Upload-File','/myNCI-preprod/Shared%20Documents/');
await urlsConverted.loadURLs(drupalExport.drupal.holidayEvents,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.organizationDetails,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.policy,'Path','/Inside/en-us/');

// Set up the SharePoint connection
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
let site = new AkuminaSite(spConfig);
let userList = site.sp.web.lists.getByTitle('User Information List');
const users = await userList.items.getAll();

await drupalExport.prepareContent(urlsConverted, users, drupalUsers, taxonomyList);
// Reset the site, deleting all the old content
await site.reset();

// const importTest = [
//   {
//     path: '',
//     name: "",
//     data: {
//       Description: ""
//     }
//   }
// ];
// Import images
let images = drupalExport.findUsedImages();
await site.importFiles('LIST_NAME', images); // will probably need to convert images to the correct format before importing;

// Import files
let files = drupalExport.findLinkedFiles();
await site.importFiles('LIST_NAME', files); // will probably need to convert files to the correct format before importing;

// const importTest = [
//   {
//     Title: 'Batch Test 1'
//   },
//   {
//     Title: 'Batch Test 2'
//   },
//   {
//     Title: 'Batch Test 3'
//   }];
// Import blogs
await site.importList('TEST_data_migration', drupalExport.akumina.blogs); // will probably need to convert drupalExport.blogs to the correct format before importing;

// Import events
await site.importList('TEST_data_migration', drupalExport.akumina.events); // will probably need to convert drupalExport.events to the correct format before importing;

// Import pages
//await site.importList('TEST_data_migration', drupalExport.pages); // will probably need to convert drupalExport.pages to the correct format before importing;

let exclude = [3, 4, 6, 7, 8, 10, 12, 14, 15, 18, 19, 20, 23, 25, 26, 30, 31, 32, 33, 35, 37, 38, 39, 40, 41, 42, 43, 57, 58, 59, 60, 61, 62, 63, 70, 71, 72, 75, 76, 78]
await site.truncateList('TEST_data_migration', exclude);