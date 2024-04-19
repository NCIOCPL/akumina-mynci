import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import AkuminaSite from './lib/akumina-site.js';
import DrupalContent from './lib/drupal-content.js';
import URLConverter from './lib/url-converter.js';
import DrupalUserlist from "./lib/drupal-userlist.js";

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
  mediaFiles: '../content/media-files.xml',
  mediaImages: '../content/media-images.xml',
  organizationDetails: '../content/organization-details.xml',
  policy: '../content/policy.xml',
};

// Set up the export data
let drupalExport = new DrupalContent();
await drupalExport.loadContent(drupalExports);

//Create the map of old to new urls
let urlsConverted = new URLConverter();
let drupalUsers = new DrupalUserlist();
await urlsConverted.loadURLs(drupalExport.drupal.file,'Path','/sites/NCI-OCPL-myNCI-preprod/Shared%20Documents/');
await urlsConverted.loadURLs(drupalExport.drupal.file,'Upload-File','/sites/NCI-OCPL-myNCI-preprod/Shared%20Documents/');
await urlsConverted.convertFileURLs(drupalExport.drupal.file);
await urlsConverted.loadURLs(drupalExport.drupal.mediaImages,'Path','/NCI-OCPL-myNCI-preprod/Images1/');
await urlsConverted.loadURLs(drupalExport.drupal.mediaFiles,'Path','/sites/NCI-OCPL-myNCI-preprod/Shared%20Documents/');
await urlsConverted.loadURLs(drupalExport.drupal.about,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.announcements,'Path','/FoundationNews/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.blogs,'Path','/Blogs/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.coreContent,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.events,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.holidayEvents,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.organizationDetails,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.policy,'Path','/Inside/en-us/');

const counter = {};
for( const [key, value] of urlsConverted.urls){
  let slug = value.slug;
  if(counter[slug]){
    counter[slug] += 1;
    value.isUnique = false;
    value.newSlug = slug + '_' + counter;
  } else {
    counter[slug] = 1;
  }
}
// Set up the SharePoint connection
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
let site = new AkuminaSite(spConfig);
let userList = site.sp.web.lists.getByTitle('User Information List');
const users = await userList.items.getAll();

let akTaxonomyList = site.sp.web.lists.getByTitle('TaxonomyHiddenList');
const taxonomyTags = await akTaxonomyList.items.getAll();

let taxonomyFields = {
  Tags:'',
  Departments:'',
  Region:''
}

const BlogFieldTags_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Tags_1'")();
const BlogFieldDepartments_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Departments_1'")();
const BlogFieldRegion_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Region_1'")();
taxonomyFields.Tags = BlogFieldTags_one[0].StaticName;
taxonomyFields.Departments = BlogFieldDepartments_one[0].StaticName;
taxonomyFields.Region = BlogFieldRegion_one[0].StaticName;

// Prepare the content for importing
await drupalExport.prepareContent(urlsConverted, users, drupalUsers, taxonomyTags, taxonomyFields);

//// Import images
await site.importFiles('Images1', drupalExport.akumina.mediaImages);
//// Import files
await site.importFiles('Shared%20Documents', drupalExport.akumina.mediaFiles);
await site.importFiles('Shared%20Documents', drupalExport.akumina.file);
// Import blogs

await site.truncateList('Blogs_AK');
await site.importList('Blogs_AK', drupalExport.akumina.blogs);
await site.updateListIds('Blogs_AK');
await site.publishListItems("Blogs_AK", 'Imported from Drupal myNCI');


//// Import events

await site.truncateList('Calendar_AK');
await site.importList('Calendar_AK', drupalExport.akumina.events);
await site.importList('Calendar_AK', drupalExport.akumina.holidayEvents);
await site.updateListIds('Calendar_AK');
await site.publishListItems("Calendar_AK", 'Imported from Drupal myNCI');


//// Import pages
await site.truncateList('InternalPages_AK');
await site.importList('InternalPages_AK', drupalExport.akumina.coreContent, 50);
await site.updateListIds('InternalPages_AK');
await site.publishListItems("InternalPages_AK", 'Imported from Drupal myNCI');