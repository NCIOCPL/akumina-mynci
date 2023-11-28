import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import AkuminaSite from './lib/akumina-site.js';
import DrupalContent from './lib/drupal-content.js';

// Retrieve our secrets
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../.env` });

// Define our content export location
const drupalExports = {
  blogs: 'path/to/blogs.xml',
  events: 'path/to/events.xml',
};

// Set up the export data
var drupalExport = new DrupalContent();
await drupalExport.loadContent(drupalExports);

// Set up the SharePoint connection
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
var site = new AkuminaSite(spConfig);

// Reset the site, deleting all the old content
await site.reset();

// Import images
var images = drupalExport.findUsedImages();
await site.importFiles('LIST_NAME', images); // will probably need to convert images to the correct format before importing;

// Import files
var files = drupalExport.findLinkedFiles();
await site.importFiles('LIST_NAME', files); // will probably need to convert files to the correct format before importing;

// Import blogs
await site.importList('TEST_data_migration', drupalExport.blogs); // will probably need to convert drupalExport.blogs to the correct format before importing;

// Import events
await site.importList('TEST_data_migration', drupalExport.events); // will probably need to convert drupalExport.events to the correct format before importing;

// Import pages
await site.importList('TEST_data_migration', drupalExport.pages); // will probably need to convert drupalExport.pages to the correct format before importing;