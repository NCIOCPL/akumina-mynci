import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';
import URLConverter from './url-converter.js';
import { promises as fs } from 'fs';

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
   */
  async importFiles(listPath, items) {
    console.log('Importing ' + items.length + ' files to ' + listPath + '...')
    try {
      // Loop through files provided
      for (let i = 0; i < items.length; i++) {
        const fileContents = await fs.readFile(items[i].path, {
          encoding: null,
        });

        // Upload each item to SharePoint
        const file = await sp.web
          .getFolderByServerRelativeUrl(listPath)
          .files.add(items[i].name, fileContents, true);

        // get item and update the uploaded file with the metadata
        const item = await file.file.getItem();
        await item.update(items[i].data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Import list items to SharePoint list
   *
   * @param {string} listName SharePoint list name
   * @param {Array<object>} items An array of items to import, each item containing only the appropriately named columns
   * @param {integer} batchSize Size of batches when looping
   */
  async importList(listName, items, batchSize = 100) {
    // Loop through the items provided
    // Construct batches of the batchSize
    // For each batch, add the items to the list in batch
    // Commit the batch
    // Continue to the next batch until done

    console.log('Importing ' + items.length + ' items to ' + listName + '...');

    const list = sp.web.lists.getByTitle(listName);
    let itemsImported = 0;

    while (itemsImported < items.length) {
      const batch = sp.createBatch();

      for (let i = 0; i < batchSize && itemsImported < items.length; i++) {
        list.items.inBatch(batch).add(items[itemsImported]);
        itemsImported++;
      }

      await batch.execute();
    }
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
   * @param {integer} batchSize Size of batches when looping
   */
  async truncateList(listName, exclude = [], batchSize = 100) {
    console.log('Truncating list ' + listName + '...');
    const list = sp.web.lists.getByTitle(listName);
    const allItems = (await list.items.select('Id').getAll())
      .filter((item) => !exclude.includes(item.Id))
      .map((item) => item.Id);

    while (allItems.length > 0) {
      const batch = sp.createBatch();

      for (let i = 0; i < batchSize && allItems.length > 0; i++) {
        list.items.getById(allItems.pop()).inBatch(batch).delete();
      }

      await batch.execute();
    }
  }
}

export default AkuminaSite;
