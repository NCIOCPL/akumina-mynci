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

// Prepare the content for importing
await drupalExport.prepareContent(urlsConverted, users, drupalUsers, taxonomyList);

//// Import images
//let images = drupalExport.findUsedImages();
//await site.importFiles('LIST_NAME', images); 

//// Import files
//let files = drupalExport.findLinkedFiles();
//await site.importFiles('LIST_NAME', files); 

// Import blogs
//await site.truncateList('Blogs_AK');
//await site.importList('Blogs_AK', drupalExport.akumina.blogs); 
//await site.updateListIds('Blogs_AK')

//// Import events
//await site.truncateList('Calendar_AK');
//await site.importList('Calendar_AK', drupalExport.akumina.events); 
//await site.importList('Calendar_AK', drupalExport.akumina.holidayEvents); 
//await site.updateListIds('Calendar_AK')

//// Import pages
//await site.truncateList('InternalPages_AK')
//await site.importList('InternalPages_AK', drupalExport.akumina.coreContent); 
//await site.updateListIds('InternalPages_AK')