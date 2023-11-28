import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';

/**
 * Represents an extraction of content from the Drupal 7 site
 *
 */

class DrupalContent {
  /**
   * Creates a new instance of a Drupal Content client.
   */
  constructor() {
    this.images = new Array();
    this.files = new Array();
    this.blogs = new Array();
    this.events = new Array();
    this.pages = new Array();
  }

  /**
   * Load content from XML export.
   *
   *
   * @param {object} exports Export file paths by key.
   * @param {string} exports.blogs API site URL.
   */
  async loadContent({ blogs = null, events = null } = {}) {
    try {
      // TBD: Reference actual files, maybe in a loop?
      const filePath = './__mocks/export_content.xml';
      const xmlData = await fsPromises.readFile(filePath);

      const parser = new xml2js.Parser();
      const results = await parser.parseStringPromise(xmlData);

      // TBD: Point to results of files above
      this.blogs = results.nodes.node;
      this.events = results.nodes.node;
      this.pages = results.nodes.node;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  /**
   * Find all files linked in content.
   *
   * @returns {Array<object>} An array of file objects used in the content
   */
  async findLinkedFiles() {}

  /**
   * Find all images used in content.
   *
   * @returns {Array<object>} An array of image objects used in the content
   */
  async findUsedImages() {}
}



export default DrupalContent;
