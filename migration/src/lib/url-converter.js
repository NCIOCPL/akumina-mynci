/**
 * URL Converter
 *
 */
class URLConverter {
  /**
   * Creates a new instance of a URL Converter
   *
   */

  constructor() {
    //super(); // Call the constructor of the parent class
    this.urls = new Map();
    this.urlNIDs = new Map();
  }

  /**
   * Adds a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @param {string} newURL The new URL to replace the old URL
   */
  async add(oldURL, newURL) {
    this.urls.set(oldURL, newURL);
  }

  /**
   * Adds a URL to be converted
   *
   * @param {string} oldNID The drupal NID to use for reference
   * @param {string} newURL The new URL to replace the old URL
   */
  async addNID(oldNID, newURL) {
    this.urlNIDs.set(oldNID, newURL);
  }
  /**
   * Retrieves a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @returns {Promise<string>} The new URL
   */
  async lookup(oldURL) {
    if(this.urls.has(oldURL)){
      return this.urls.get(oldURL);
    } else {
      return 'Not Found';
    }
  }
  /**
   * Retrieves a URL to be converted from drupal NID
   *
   * @param {string} NID The old URL to use for reference
   * @returns {Promise<string>} The new URL
   */
  async lookupNID(NID) {
    if(this.urlNIDs.has(NID)){
      return this.urlNIDs.get(NID);
    } else {
      return 'Not Found';
    }
  }
  /**
   * Loops through array of objects and adds contents to list of urls for conversion
   *
   * @param {array} items
   * @param {string} urlAlias
   * @param {string} newPath
   * @returns {Promise<void>}
   */
  async loadURLs(items, urlAlias,newPath){
    items.forEach((item) => {
      let oldURL = item[urlAlias];
      if (Array.isArray(item[urlAlias])) {
        oldURL = item[urlAlias][0];
      }
      let NID = oldURL;
      if(item['Nid']){
        NID = item['Nid'];
      }
      if (Array.isArray(item['Nid'])) {
        NID = item['Nid'][0];
      }
      let slug = oldURL.split('/').pop();
      let newURL = newPath + slug;
      this.add(oldURL,newURL);
      this.addNID(NID,newURL);
    })
  }
}

export default URLConverter;
