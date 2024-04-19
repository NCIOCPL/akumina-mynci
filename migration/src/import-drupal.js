import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import AkuminaSite from './lib/akumina-site.js';
import DrupalContent from './lib/drupal-content.js';
import URLConverter from './lib/url-converter.js';
import DrupalUserlist from "./lib/drupal-userlist.js";
import OrgMap from '../content/org-map.json' assert { type: 'json' };
import RedirectMap from '../content/redirects.json' assert { type: 'json' };
import TaxonomyRedirectMap from '../content/taxonomy-redirects.json' assert { type: 'json' };

import FileSystem from 'fs';
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
//const prodPath = 'myNCI';
//const devPath = 'NCI-OCPL-myNCI-preprod';
//const importPath = devPath;
//const importPath = prodPath;

// Set up the SharePoint connection
const spConfig = {
  siteURL: process.env.SITE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  sitePath: process.env.SITE_PATH,
  absoluteDomain: process.env.ABSOLUTE_DOMAIN,
  imagePrefix: process.env.IMAGE_PREFIX,
  personaIdAll: process.env.PERSONA_ID_ALL,
  blogListID: process.env.BLOG_LIST_ID,
  internalPageListID: process.env.INTERNAL_PAGE_LIST_ID,
  calendarListID: process.env.CALENDAR_LIST_ID,
  genericHTMLListID: process.env.GENERIC_HTML_LIST_ID,
};
//import json map of organization acronyms to names

await urlsConverted.loadURLs(drupalExport.drupal.file,'Path','/sites/' + spConfig.sitePath + '/Shared%20Documents/', true);
await urlsConverted.loadURLs(drupalExport.drupal.file,'Upload-File','/sites/' + spConfig.sitePath + '/Shared%20Documents/', true);
await urlsConverted.convertFileURLs(drupalExport.drupal.file);
await urlsConverted.loadURLs(drupalExport.drupal.mediaImages,'Path','/' + spConfig.sitePath + '/Images1/', true);
await urlsConverted.loadURLs(drupalExport.drupal.mediaFiles,'Path','/sites/' + spConfig.sitePath + '/Shared%20Documents/', true);
await urlsConverted.loadURLs(drupalExport.drupal.about,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.announcements,'Path','/FoundationNews/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.blogs,'Path','/Blogs/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.coreContent,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.events,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.holidayEvents,'Path','/Events/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.organizationDetails,'Path','/Inside/en-us/');
await urlsConverted.loadURLs(drupalExport.drupal.policy,'Path','/Inside/en-us/');

/*const counter = {};
for( const [key, value] of urlsConverted.urls){
  let slug = value.slug;
  if(counter[slug]){
    counter[slug] += 1;
    value.isUnique = false;
    value.newSlug = slug + '_' + counter;
  } else {
    counter[slug] = 1;
  }
}*/

let site = new AkuminaSite(spConfig);
let userList = site.sp.web.lists.getByTitle('User Information List');
const users = await userList.items.getAll();

let akTaxonomyList = site.sp.web.lists.getByTitle('TaxonomyHiddenList');
const taxonomyTags = await akTaxonomyList.items.getAll();

let taxonomyFields = {
  Tags:'',
  Departments:'',
  Region:'',
  NCIOrgOwner:''
}

const BlogFieldTags_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Tags_1'")();
const BlogFieldDepartments_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Departments_1'")();
const BlogFieldRegion_one = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Region_1'")();
const BlogFieldNCIOrgOwner_zero = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Organization Owner_0'")();
const BlogFieldPersona_zero = await site.sp.web.lists.getByTitle('Blogs_AK').fields.filter("Title eq 'Persona_0'")();


let images = await site.sp.web.lists.getByTitle('Images');
let currentImages = await images.items.getAll();
const ImageFields = await site.sp.web.lists.getByTitle('Images').fields();
let ImageFieldTitles = ImageFields.map(a => a.Title);

let documents = await site.sp.web.lists.getByTitle('Documents');
let currentDocuments = await documents.items.getAll();
const DocumentFields = await site.sp.web.lists.getByTitle('Documents').fields();
let DocumentFieldTitles = DocumentFields.map(a => a.Title);
//Debugging variables:

let blogs = await site.sp.web.lists.getByTitle('Blogs_AK');
let currentBlogs = await blogs.items.getAll();
const BlogFields = await site.sp.web.lists.getByTitle('Blogs_AK').fields();
let BlogFieldTitles = BlogFields.map(a => a.Title);

let TaxonomyFieldTitles = taxonomyTags.map(a => a.Title);

let internalPages = await site.sp.web.lists.getByTitle('InternalPages_AK');
let currentPages = await internalPages.items.getAll();

let events = await site.sp.web.lists.getByTitle('Calendar_AK');
let currentEvents = await events.items.getAll();
const EventFieldRegion_one = await site.sp.web.lists.getByTitle('Calendar_AK').fields.filter("Title eq 'Region_1'")();
const EventFields = await site.sp.web.lists.getByTitle('Calendar_AK').fields();
let EventFieldTitles = EventFields.map(a => a.Title);
//end debugging


taxonomyFields.Tags = BlogFieldTags_one[0].StaticName;
taxonomyFields.Departments = BlogFieldDepartments_one[0].StaticName;
taxonomyFields.Region = BlogFieldRegion_one[0].StaticName;
taxonomyFields.NCIOrgOwner = BlogFieldNCIOrgOwner_zero[0].StaticName;
taxonomyFields.Persona = BlogFieldPersona_zero[0].StaticName;
// Prepare the content for importing
await drupalExport.prepareContent(urlsConverted, users, drupalUsers, taxonomyTags, taxonomyFields, OrgMap, RedirectMap, TaxonomyRedirectMap, spConfig, currentImages, currentDocuments);

//Build lists of old to new urls for redirect purposes
let oldUrlsToNewUrls = [];

for(const url of urlsConverted.urls) {
  let URLRedirect = {prettyUrl:'',nodeUrl:'/node/',newUrl:''}

  URLRedirect.prettyUrl = url[0];
  URLRedirect.nodeUrl += url[1].nid;
  URLRedirect.newUrl = url[1].url;
  oldUrlsToNewUrls.push(URLRedirect);
}

for(const url of RedirectMap) {
  let found = oldUrlsToNewUrls.find(item => item.nodeUrl === url.Redirect);
  if(found && found.hasOwnProperty('newUrl') && (found.newUrl!=='')){
    url.AkuminaUrl = found.newUrl;
  } else {
    url.AkuminaUrl = '';
  }
}
for(const url of TaxonomyRedirectMap) {
  let found = oldUrlsToNewUrls.find(item => item.nodeUrl === url.Source);
  if(found && found.hasOwnProperty('newUrl') && (found.newUrl!=='')){
    url.AkuminaUrl = '/sitepages/orgdirectory.aspx';
  }
}

FileSystem.writeFile('../content/akuminaRedirects.json', JSON.stringify(RedirectMap), (error) => {
  if (error) throw error;
});
FileSystem.writeFile('../content/akuminaTaxonomyRedirects.json', JSON.stringify(TaxonomyRedirectMap), (error) => {
  if (error) throw error;
});
/*
// Import images
await site.importFiles('Images1', drupalExport.akumina.mediaImages, true);

// Import files
await site.importFiles('Shared%20Documents', drupalExport.akumina.mediaFiles, true);
await site.importFiles('Shared%20Documents', drupalExport.akumina.file, true);
*/
/*
// Import blogs
await site.truncateList('Blogs_AK');
await site.importList('Blogs_AK', drupalExport.akumina.blogs, 25);
await site.updateListIds('Blogs_AK');
await site.publishListItems("Blogs_AK", 'Imported from Drupal myNCI');

//// Import pages
await site.truncateList('InternalPages_AK');
await site.importList('InternalPages_AK', drupalExport.akumina.coreContent, 15);
await site.updateListIds('InternalPages_AK');
await site.publishListItems("InternalPages_AK", 'Imported from Drupal myNCI');

// Import Org Details
await site.truncateList('GenericHTML_AK');
await site.importList('GenericHTML_AK', drupalExport.akumina.organizationDetails, 15);
await site.updateListIds('GenericHTML_AK', 15, true);
await site.publishListItems("GenericHTML_AK", 'Imported from Drupal myNCI');

//// Import events
await site.truncateList('Calendar_AK');
await site.importList('Calendar_AK', drupalExport.akumina.events, 25, 'events');
await site.importList('Calendar_AK', drupalExport.akumina.holidayEvents, 25, 'holidayEvents');
await site.updateListIds('Calendar_AK');
await site.publishListItems("Calendar_AK", 'Imported from Drupal myNCI');
*/

//Update Body links on Akumina
/*
await site.updateListBodyLinks('Blogs_AK',15);
await site.publishListItems("Blogs_AK", 'Body Links updated');
await site.updateListBodyLinks('InternalPages_AK',15);
await site.publishListItems("InternalPages_AK", 'Body Links updated');
await site.updateListBodyLinks('GenericHTML_AK',15);
await site.publishListItems("GenericHTML_AK", 'Body Links updated');
await site.updateListBodyLinks('Calendar_AK',15);
await site.publishListItems("Calendar_AK", 'Body Links updated');
*/
await site.queryListAnchorLinks('Blogs_AK');
await site.queryListAnchorLinks('InternalPages_AK');
await site.queryListAnchorLinks('GenericHTML_AK');
await site.queryListAnchorLinks('Calendar_AK');