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
   * @param {string} newURL The new URL to replace the old URL
   */
  async add(oldURL, newURL) {
    this.urls.set(oldURL, newURL);
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
      let slug = oldURL.split('/').pop();
      let newURL = newPath + slug;
      this.add(oldURL,newURL);
    })
  }
}

export default URLConverter;
