import SPBase from '../base.js';

/**
 * Items
 */
class SPList extends SPBase {
  /**
   * Creates a new instance of SPList
   *
   * @param {SPClient} client A SharePoint client from node-sp-auth.
   * @param {string} siteURL The base SharePoint URL.
   */

  constructor(client, siteURL) {
    super(client, siteURL); // Call the constructor of the parent class (SPBase)
  }

  /**
   * Lists the items in the list.
   *
   * @param {string} listName A SharePoint list title.
   */
  async listItems(listName) {
    try {
      const SPClient = await this.client;
      const headers = SPClient.headers;
      headers['Accept'] = 'application/json;odata=verbose';

      let url = `${this.siteURL}_api/web/lists/getbytitle('${listName}')/items?$select=Title&$top=100`;

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
      this.handleSPerror(error);
    }
  }

  /**
   * Adds an item to a list.
   *
   * @param {string} listName A SharePoint list title.
   * @param {string} type A SharePoint ListItemEntityTypeFullName.
   * @param {object} itemData The SharePoint item data.
   */
  async addItem(listName, type, itemData) {
    console.log('Stubbed out');
  }

  /**
   * Add items to a list.
   *
   * @param {string} listName A SharePoint list title.
   * @param {string} type A SharePoint ListItemEntityTypeFullName.
   * @param {Array<Object>} items An array of SharePoint item data objects.
   */
  async addItems(listName, type, items) {
    console.log('Stubbed out');
  }

  /**
   * Deletes an item to a list.
   *
   * @param {string} listName A SharePoint list title.
   * @param {string} itemId The SharePoint item ID.
   */
  async deleteItem(listName, itemId) {
    try {
      //const SPClient = await this.client;
      const headers = {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json',
        'If-Match': '"1"',
        'X-HTTP-Method': 'DELETE'
      };

      let url = `${this.siteURL}_api/web/lists/GetByTitle('${listName}')/items(${itemId})`;
      
      //console.log(url);
      //await this.axios.delete(url);

      let item = await this.axios ({
        method: 'post',
        url: url,
        headers: headers,
        data: {},
      });

    //this.axios.delete(item);
    console.log('successfully deleted:' + item);
    } catch (error) {
      this.handleSPerror(error);
    }
  }

  /**
   * Delete items to a list.
   *
   * @param {string} listName A SharePoint list title.
   * @param {Array<String>} items An array of SharePoint item IDs.
   */
  async deleteItems(listName, items) {
    console.log('Stubbed out');
  }
}

export default SPList;
