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
  async add(oldURL, newURL) {}

  /**
   * Retrieves a URL to be converted
   *
   * @param {string} oldURL The old URL to use for reference
   * @returns {Promise<string>} The new URL
   */
  async lookup(oldURL) {}
}

export default URLConverter;
