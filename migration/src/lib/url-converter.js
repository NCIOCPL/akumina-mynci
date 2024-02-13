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
  }

  /**
   * Adds a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @param {string} oldNID The drupal NID to use for reference
   * @param {string} newURL The new URL to replace the old URL
   */
  async add(oldURL, oldNID, newURL) {
    if(!this.urls.has(oldURL)) {
      this.urls.set(oldURL, {url: newURL, nid: oldNID, isActive: false});
    }
  }
  /**
   * Retrieves a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @returns {Promise<string>} The new URL
   */
  async lookup(oldURL) {
    if(this.urls.has(oldURL)){
      this.urls.get(oldURL).isActive = true;
      return this.urls.get(oldURL);
    } else {
      return 'Not Found';
    }
  }
  /**
   * Retrieves a URL to be converted from drupal NID
   *
   * @param {string} NID The old NID to use for reference
   * @returns {Promise<string>} The new URL
   */
  async lookupNID(NID) {
    for (let [key, value] of this.urls.entries()) {
      if (value.nid === NID){
        this.urls.get(key).isActive = true;
        return this.urls.get(key);
      }
    }
    return 'Not Found';
  }

  /**
   * Retrieves the active status of a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @returns {Promise<boolean>|Promise<string>} The active status of URL
   */
  async lookupActive(oldURL) {
    if(this.urls.has(oldURL)){
      return this.urls.get(oldURL).isActive;
    } else {
      return 'Not Found';
    }
  }
  /**
   * Retrieves the active status of a URL to be converted converted from drupal NID
   *
   * @param {string} NID The old NID to use for reference
   * @returns {Promise<boolean>|Promise<string>} The active status of URL
   */
  async lookupActiveNID(NID) {
    for (let [key, value] of this.urls.entries()) {
      if (value.nid === NID){
        return this.urls.get(key).isActive;
      }
    }
    return 'Not Found';
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
      this.add(oldURL,NID,newURL);
    })
  }
}

export default URLConverter;
