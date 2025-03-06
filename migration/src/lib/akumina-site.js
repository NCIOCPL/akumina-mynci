import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';
import URLConverter from './url-converter.js';
import { promises as fs } from 'fs';
import FileSystem from 'fs';
import DrupalContent from "./drupal-content.js";
import {DOMParser} from "@xmldom/xmldom";

/**
 * Represents an Akumina SharePoint site
 *
 */

class AkuminaSite {
  /**
   * Creates a new instance of a SharePoint API client.
   *
   * @param {*} config Configuration parameters for the client.
   * @param {*} config.siteURL API site URL.
   * @param {*} config.clientId API client ID.
   * @param {*} config.clientSecret API client secret.
   */
  constructor({ siteURL = null, clientId = null, clientSecret = null } = {}) {
    if (!siteURL) {
      throw new Error('SharePoint site URL is required.');
    }

    if (!clientId) {
      throw new Error('Client ID is required.');
    }

    if (!clientSecret) {
      throw new Error('Client secret is required..');
    }

    // set up the site using pnp-auth
    bootstrap(
        sp,
        {
          clientId: clientId,
          clientSecret: clientSecret,
        },
        siteURL
    );

    this.sp = sp;
  }

  /**
   * Convert URLs
   *
   */
  async getURLConverter() {
    return new URLConverter();
  }

  /**
   * Import files to SharePoint library
   *
   * @param {string} listPath Path to SharePoint list
   * @param {Array<object>} items An array of items to import
   * @param {string} items[n].path Path to the file to upload
   * @param {string} items[n].name Name of file being uploaded
   * @param {object} items[n].data Metadata to be added to the file
   * @param {boolean} checkIfOnServer flag to check if file exists on server
   */
  async importFiles(listPath, items, checkIfOnServer= false) {
    console.log('Importing ' + items.length + ' files to ' + listPath + '...')
    // Loop through files provided
    for (let i = 0; i < items.length; i++) {
      try {
        //If checkIsOnServer is true, we only want to import if the file isn't already there
        if (items[i].hasOwnProperty('metadata')
            && items[i].metadata.hasOwnProperty('migrate')
            && items[i].metadata.migrate
            && items[i].metadata.hasOwnProperty('ExistingPath')
        && (!checkIfOnServer ||
            (checkIfOnServer && (items[i].metadata.hasOwnProperty('isOnAkumina')) && (items[i].metadata.isOnAkumina === false))) ) {
          let existingPath = items[i].metadata["ExistingPath"].replaceAll('mynci.cancer.gov','');
          console.log('Importing File # ' + i + ', ' + items[i].columns.Title + ' Path: ' + existingPath);

          const fileContents = await fs.readFile(existingPath, {
            encoding: null,
          });

          // Upload each item to SharePoint
          const file = await sp.web
              .getFolderByServerRelativeUrl(listPath)
              .files.add(items[i].columns.Name, fileContents, true);

          // get item and update the uploaded file with the metadata
          const item = await file.file.getItem();
          //await item.update(items[i].data);
          if(listPath === 'Images1'){
            await item.update({
              Title: items[i].columns.Title,
              OData__x0024_Resources_x003a_core_x002c_Title_x003b_: items[i].columns.OData__x0024_Resources_x003a_core_x002c_Title_x003b_,
              Created: items[i].columns.Created
            });
          } else {
            await item.update({
              Title: items[i].columns.Title,
              Created: items[i].columns.Created
            });
          }

        }
      }catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Import list items to SharePoint list
   *
   * @param {string} listName SharePoint list name
   * @param {Array<object>} items An array of items to import, each item containing only the appropriately named columns
   * @param {number} batchSize Size of batches when looping
   * @param {string} drupalExportName Size of batches when looping
   */
  async importList(listName, items, batchSize = 100, drupalExportName = '') {
    // Loop through the items provided
    // Construct batches of the batchSize
    // For each batch, add the items to the list in batch
    // Commit the batch
    // Continue to the next batch until done

    console.log('Importing ' + items.length + ' items to ' + listName + '...');
    const list = sp.web.lists.getByTitle(listName);
    let itemsImported = 0;
    let batchExecuted = false;
    let addedContent = 0;
    let now = new Date();
    let oneYearInPast = new Date();
    oneYearInPast.setFullYear(now.getFullYear() -1);
    oneYearInPast = oneYearInPast.toISOString();
    let migrate = false;
    let eventDate = new Date();
    let exportList = [];
    while ((itemsImported < items.length) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (itemsImported < items.length); i++) {
        migrate = false;
        if((listName ==='Blogs_AK') || (listName ==='GenericHTML_AK')) {
          migrate = true;
        } else if (listName === 'InternalPages_AK') {
          if(items[itemsImported].metadata.hasOwnProperty('MigrateAdminUse') &&
              (items[itemsImported].metadata['MigrateAdminUse'] === 'true')){
            migrate = true;
          }
        }
        else if (listName === 'Calendar_AK') {
          if(items[itemsImported].columns.hasOwnProperty('EventDate')) {
            eventDate = items[itemsImported].columns['EventDate'];
            if (eventDate >= oneYearInPast ){
              migrate = true;
            }
          }
        }
        if(migrate === true) {
          list.items.inBatch(batch).add(items[itemsImported].columns);
          console.log('Importing Content Node # ' + itemsImported + ', ' + items[itemsImported].columns.Title);
          //Generating lists for reports
          let itemPrefix = '';
          switch(listName) {
            case 'Blogs_AK':
              itemPrefix = '/Blogs/en-us/';
              break;
            case 'GenericHTML_AK':
              itemPrefix = '/Inside/en-us/';
              break;
            case 'InternalPages_AK':
              itemPrefix = '/Inside/en-us/';
              break;
            case 'Calendar_AK':
              itemPrefix = '/Events/en-us/';
              break;
          }

          let newItemUrl = itemPrefix + items[itemsImported].columns.StaticUrl;
          let itemAdded = {title: items[itemsImported].columns.Title,
          oldURL: items[itemsImported].metadata.OldPath,
            newUrl: newItemUrl
          }
          exportList.push(itemAdded);
          addedContent++;
        }
        itemsImported++;
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('itemsImported ' + itemsImported);
        console.log('addedContent ' + addedContent + ' items to ' + listName + '...');
      });
    }
    //Write reports of imported content
    let csvContent = '';
    exportList.forEach(item => {
      csvContent += item + ',' + '\n';
    })
    let reportJsonFile = '';
  switch(listName) {
      case 'Blogs_AK':
       // FileSystem.writeFile('../content/blogList.csv', csvContent, (error) => {
        reportJsonFile = '../content/blogList.json';
        break;
    case 'GenericHTML_AK':
      reportJsonFile = '../content/genericHTMLList.json';
      break;
    case 'InternalPages_AK':
      reportJsonFile = '../content/internalPagesList.json';
      break;
    case 'Calendar_AK':
      if(drupalExportName && drupalExportName === 'events'){
        reportJsonFile = '../content/calendarList.json';
      } else if (drupalExportName && drupalExportName === 'holidayEvents') {
        reportJsonFile = '../content/holidayCalendarList.json';
      } else {
        reportJsonFile = '../content/calendarList.json';
      }
      break;
    }
    FileSystem.writeFile(reportJsonFile, JSON.stringify(exportList), (error) => {
      if (error) throw error;
    });
  }

  /**
   * Delete relevant content from the Akumina site
   *
   */
  async reset() {
    await this.truncateList('Blogs_AK');
    await this.truncateList('Calendar_AK');
    await this.truncateList('InternalPages_AK')
    /* To do: files deletion */
  }

  /**
   * Delete all content from a SharePoint list.
   *
   * @param {string} listName A SharePoint list name.
   * @param {Array<integer>} exclude A list of IDs to exclude
   * @param {number} batchSize Size of batches when looping
   */
  async truncateList(listName, exclude = [], batchSize = 100) {
    console.log('Truncating list ' + listName + '...');
    const list = sp.web.lists.getByTitle(listName);
    const allItems = (await list.items.select('Id').getAll())
        .filter((item) => !exclude.includes(item.Id))
        .map((item) => item.Id);
    let batchExecuted = false;
    while ((allItems.length > 0) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (allItems.length > 0); i++) {
        list.items.getById(allItems.pop()).inBatch(batch).delete();
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('Items left to truncate ' + allItems.length);
      });
    }
  }
  /**
   * Update listIDs in a SharePoint list.
   *
   * @param {string} listName A SharePoint list name.
   * @param {number} batchSize Size of batches when looping
   * @param {boolean} skipFriendlyURLs Size of batches when looping
   */
  async updateListIds(listName, batchSize = 100, skipFriendlyURLs = false) {
    let list = sp.web.lists.getByTitle(listName);
    let allItems;
    if(!skipFriendlyURLs) {
      allItems = (await list.items.select('Id', 'Title', 'FriendlyUrl').getAll());
    } else {
      allItems = (await list.items.select('Id', 'Title').getAll());
    }
    let numItems = allItems.length;
    console.log('Updating ' + numItems + ' List IDs for ' + listName + '...');
    let batchExecuted = false;
    let itemIndex = 0;
    while ((numItems > 0) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (numItems > 0); i++) {
        list.items.getById(allItems[itemIndex].Id).inBatch(batch).update({ AkId: allItems[itemIndex].Id });
        if(!skipFriendlyURLs) {
          list.items.getById(allItems[itemIndex].Id).inBatch(batch).update({FriendlyUrlSearch: allItems[itemIndex].FriendlyUrl});
        }
        numItems--;
        itemIndex++;
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('Item IDs left to update ' + numItems);
      });
    }
  }

  /**
   * Update updateListBodyLinks in a SharePoint list.
   *
   * @param {string} listName A SharePoint list name.
   * @param {number} batchSize Size of batches when looping
   */
  async queryListAnchorLinks(listName, batchSize = 100) {
    let list = sp.web.lists.getByTitle(listName);
    let allItems;
    allItems = (await list.items.select('Id', 'Title', 'Body').getAll());
    let numItems = allItems.length;
    console.log('Querying ' + numItems + ' anchor links for ' + listName + '...');
    let batchExecuted = false;
    let itemIndex = 0;
    let numberOfItemsChanged = 0;
    let totalNumberOfAnchorTags = 0;
    while ((numItems > 0) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (numItems > 0); i++) {
        //Update links in body to change static domain, transform // into /#/
        let content = '<body>' + allItems[itemIndex].Body + '</body>';
        const parser = new DOMParser();
        let htmlDoc = await parser.parseFromString(content, "text/html");
        let numberOfAnchorTags = 0;
        const htmlTags = htmlDoc.getElementsByTagName('a');
        for (let index=0; index< htmlTags.length; index++) {
          let tag = htmlTags[index];
          let newURL = tag.getAttribute('href');
          let newURLPieces = newURL.split('/');
          if ((newURLPieces.length > 1) && ((!newURLPieces[0].includes('http') || (newURLPieces[2].includes('mynci.cancer.gov')) )))  {
            let slug = newURLPieces.pop();
            if(slug.includes('#')) {
              console.log('Anchor tag: ' + newURL);
              numberOfAnchorTags++;
            }
          }
        }
        if(numberOfAnchorTags > 0) {
          console.log(numberOfAnchorTags + ' anchor tags were found in:  ' + allItems[itemIndex].Title);
          totalNumberOfAnchorTags += numberOfAnchorTags;
          numberOfItemsChanged++;
        } else {
          console.log('No anchor tags were found in: ' + allItems[itemIndex].Title);
        }
        numItems--;
        itemIndex++;
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('Item anchor tags left to query ' + numItems);
      });
    }
    console.log(numberOfItemsChanged + ' nodes contained anchor tags in ' + listName);
    console.log(totalNumberOfAnchorTags + ' anchor tags found in ' + listName);
  }

  /**
   * Update updateListBodyLinks in a SharePoint list.
   *
   * @param {string} listName A SharePoint list name.
   * @param {number} batchSize Size of batches when looping
   */
  async updateListBodyLinks(listName, batchSize = 100) {
    let list = sp.web.lists.getByTitle(listName);
    let allItems;
    allItems = (await list.items.select('Id', 'Title', 'Body').getAll());
    let numItems = allItems.length;
    console.log('Updating ' + numItems + ' Body links for ' + listName + '...');
    let batchExecuted = false;
    let itemIndex = 0;
    let numberOfItemsChanged = 0;
    while ((numItems > 0) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (numItems > 0); i++) {
        //Update links in body to change static domain, transform // into /#/
        let content = '<body>' + allItems[itemIndex].Body + '</body>';
        const parser = new DOMParser();
        let htmlDoc = await parser.parseFromString(content, "text/html");
        let numberOfURLSChanged = 0;
       const htmlTags = htmlDoc.getElementsByTagName('a');
        //const htmlTags = htmlDoc.getElementsByTagName('img');
        for (let index=0; index< htmlTags.length; index++) {
          let tag = htmlTags[index];
          let newURL = tag.getAttribute('href');
          //let newURL = tag.getAttribute('src');
          let changedURL = newURL
              .replaceAll('cloud-nci.onakumina.com','mynci-appmanager.cancer.gov')
              .replaceAll('cloud-fe-nci.onakumina.com','mynci.cancer.gov')
              //.replaceAll('https://mynci.cancer.gov/directories/organizations/directory','https://cloud-fe-nci.onakumina.com/#/sitepages/orgdirectory.aspx')
              .replaceAll('//Events','/#/Events')
              .replaceAll('//events','/#/events')
              .replaceAll('//Inside','/#/Inside')
              .replaceAll('//inside','/#/inside')
              .replaceAll('m/Inside','m/#/Inside')
              .replaceAll('m/inside','m/#/inside')
              .replaceAll('d/Inside','d/#/Inside')
              .replaceAll('d/inside','d/#/inside')
              .replaceAll('v/Inside','v/#/Inside')
              .replaceAll('v/inside','v/#/inside');
          if (changedURL !== newURL) {
            tag.setAttribute('href', changedURL);
            //tag.setAttribute('src', changedURL);
            numberOfURLSChanged++;
          }

        }
        htmlDoc = htmlDoc.toString()
            .replace('<body xmlns="http://www.w3.org/1999/xhtml">','')
            .replace('</body>',''); //String
        if(numberOfURLSChanged > 0) {
          list.items.getById(allItems[itemIndex].Id).inBatch(batch).update({ Body: htmlDoc });
          console.log(numberOfURLSChanged + ' Body links were updated for:  ' + allItems[itemIndex].Title);
          numberOfItemsChanged++;
        } else {
          console.log('No matching item body links found to update in: ' + allItems[itemIndex].Title);
        }
        numItems--;
        itemIndex++;
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('Item body links left to update ' + numItems);
      });
    }
    console.log(numberOfItemsChanged + ' nodes updated in ' + listName);
  }
  async publishListItems(listName, comment, batchSize = 100) {
    let list = sp.web.lists.getByTitle(listName);
    let allItems = (await list.items.select('Id', 'Title').getAll());
    let numItems = allItems.length;
    console.log('Publishing ' + numItems + ' items for ' + listName + '...');
    let batchExecuted = false;
    let itemIndex = 0;
    while ((numItems > 0) || !batchExecuted) {
      batchExecuted = false;
      const batch = sp.createBatch();
      for (let i = 0; (i < batchSize) && (numItems > 0); i++) {
        list.items.getById(allItems[itemIndex].Id).inBatch(batch).update({
          'OData__ModerationStatus': '0',
          'OData__ModerationComments': comment
        });
        numItems--;
        itemIndex++;
      }
      await batch.execute().then(() =>{
        batchExecuted = true;
        console.log('Items left to publish ' + numItems);
      });
    }
  }
}

export default AkuminaSite;
