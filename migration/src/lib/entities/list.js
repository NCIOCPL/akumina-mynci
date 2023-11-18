import SPBase from '../base.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Items
 */
class SPList extends SPBase {
  /**
   * Creates a new instance of SPList
   *
   * @param {SPClient} client A SharePoint client from node-sp-auth.
   * @param {string} siteURL The base SharePoint URL.
   * @param {string} listName A SharePoint list title.
   */

  constructor(client, siteURL, listName) {
    super(client, siteURL); // Call the constructor of the parent class (SPBase)
    this.listName = listName;
    this.listContentType = null;
  }

  // Get list item content type for use in other requests
  async getListContentType() {
    if (this.listContentType === null) {
      try {
        const SPClient = await this.client;
        const headers = SPClient.headers;
        headers['Accept'] = 'application/json;odata=verbose';

        let response = await this.axios({
          method: 'get',
          url: `${this.siteURL}/_api/web/lists/GetByTitle('${this.listName}')?$select=ListItemEntityTypeFullName`,
          headers: headers,
        });

        // Return just the content type value
        console.log('Retrieved content type value');
        this.listContentType = response.data.d.ListItemEntityTypeFullName;
      } catch (error) {
        this.handleSPerror(error, 'Error getting list content type.');
      }
    } else {
      console.log('Used cached content type value');
    }
    return this.listContentType;
  }

  /**
   * Lists the items in the list.
   */
  async listItems() {
    try {
      const SPClient = await this.client;
      const headers = SPClient.headers;
      headers['Accept'] = 'application/json;odata=verbose';

      let url = `${this.siteURL}/_api/web/lists/getbytitle('${this.listName}')/items?$select=Title,Id&$top=100`;

      let allItems = [];

      do {
        const response = await this.axios({
          method: 'get',
          url: url,
          headers: headers,
        });

        const responseData = response.data;
        const results = responseData.d.results;

        allItems = allItems.concat(results);

        // Check if there are more pages to fetch
        if (responseData.d.__next) {
          url = responseData.d.__next;
        } else {
          break; // No more pages, exit loop
        }
      } while (true);

      return allItems;
    } catch (error) {
      this.handleSPerror(error, 'Error listing SharePoint items.');
    }
  }

  /**
   * Adds an item to a list.
   *
   * @param {object} itemData The SharePoint item data.
   */
  async addItem(itemData) {
    let contentType = await this.getListContentType();
    let formDigestValue = await this.getFormDigestValue();

    const SPClient = await this.client;
    const headers = SPClient.headers;
    headers['Accept'] = 'application/json;odata=verbose';
    headers['Content-Type'] = 'application/json;odata=verbose';
    headers['X-RequestDigest'] = formDigestValue;

    let url = `${this.siteURL}/_api/web/lists/GetByTitle('${this.listName}')/items`;

    var body = {
      __metadata: {
        type: contentType,
      },
    };

    Object.keys(itemData).forEach((key) => {
      body[key] = itemData[key];
    });
    let bodyString = JSON.stringify(body);

    console.log(bodyString);

    headers['Content-Length'] = bodyString.length;

    let response = await this.axios({
      method: 'post',
      url: url,
      headers: headers,
      data: bodyString,
    });

    console.log(response);
    return response;
  }

  /**
   * Add items to a list.
   *
   * @param {Array<Object>} items An array of SharePoint item data objects.
   */
  async addItems(items) {
    let contentType = await this.getListContentType();
    let formDigestValue = await this.getFormDigestValue();
    let batchGuid = uuidv4();
    let changesetGuid = uuidv4();
    let batchUrl = `${this.siteURL}/_api/$batch`;
    let url = `${this.siteURL}/_api/web/lists/GetByTitle('${this.listName}')/items`;

    const SPClient = await this.client;
    const headers = SPClient.headers;

    // creating the body
    var batchContents = new Array();
    items.forEach((item) => {
      var body = {
        __metadata: {
          type: contentType,
        },
      };

      Object.keys(item).forEach((key) => {
        body[key] = item[key];
      });
      let bodyString = JSON.stringify(body);

      // create the batch
      batchContents.push('--changeset_' + changesetGuid);
      batchContents.push('Content-Type: application/http');
      batchContents.push('Content-Transfer-Encoding: binary');
      batchContents.push('');
      batchContents.push('POST ' + url + ' HTTP/1.1');
      //batchContents.push('Content-Type: application/json;odata=nometadata');
      batchContents.push('Content-Type: application/json;odata=verbose');
      batchContents.push('');
      batchContents.push(bodyString);
      //batchContents.push('{"Title":"My Test Batch"}');
      batchContents.push('');
    });
    batchContents.push('--changeset_' + changesetGuid + '--');

    // generate the body of the batch
    var batchBody = batchContents.join('\r\n');

    // start with a clean array
    batchContents = new Array();

    // create batch for creating items
    batchContents.push('--batch_' + batchGuid);
    batchContents.push(
      `Content-Type: multipart/mixed; boundary="changeset_${changesetGuid}"`
    );
    batchContents.push('Host: nih.sharepoint.com');
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push(batchBody);
    batchContents.push('--batch_' + batchGuid + '--');

    batchBody = batchContents.join('\r\n');

    console.debug(batchBody);

    headers['Content-Type'] = `multipart/mixed; boundary=batch_${batchGuid}`;
    headers['Host'] = 'nih.sharepoint.com';
    headers['X-RequestDigest'] = formDigestValue;
    headers['Content-Length'] = batchBody.length;

    let response = await this.axios({
      method: 'post',
      url: batchUrl,
      headers: headers,
      data: batchBody,
    });

    console.log(response);
    return response;
  }

  /**
   * Deletes an item to a list.
   *
   * @param {string} itemId The SharePoint item ID.
   */
  async deleteItem(itemId) {
    try {
      const formDigestValue = await this.getFormDigestValue();

      const SPClient = await this.client;
      const headers = SPClient.headers;
      headers['Accept'] = 'application/json;odata=verbose';
      headers['Content-Type'] = 'application/json';
      headers['If-Match'] = '*';
      headers['X-HTTP-Method'] = 'DELETE';
      headers['X-RequestDigest'] = formDigestValue;

      let url = `${this.siteURL}/_api/web/lists/GetByTitle('${this.listName}')/items(${itemId})`;

      let item = await this.axios({
        method: 'post',
        url: url,
        headers: headers,
        data: {},
      });

      console.log('Successfully deleted: ' + item);
      return;
    } catch (error) {
      this.handleSPerror(error, 'Error deleting SharePoint item.');
    }
  }

  /**
   * Delete items to a list.
   *
   * @param {Array<String>} items An array of SharePoint item IDs.
   */
  async deleteItems(items) {
    console.log('Stubbed out');
  }
}

export default SPList;
