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
      this.about = new Array();
      this.announcements = new Array();
      this.blogs = new Array();
      this.coreContent = new Array();
      this.events = new Array();
      this.file = new Array();
      this.forms = new Array();
      this.holidayEvents = new Array();
      this.organizationDetails = new Array();
      this.policy = new Array();
  }

  /**
   * Load content from XML export.
   *
   * @param {object} exports Export file paths by key.
   */
  async loadContent(exports) {

      try {
          const exportMap = new Map(Object.entries(exports));
          for await (const key of exportMap.keys()){
              let filePath = '';
              if(exportMap.has(key)){
                  filePath = exportMap.get(key);
              }
              const xmlData = await fsPromises.readFile(filePath);
              const parser = new xml2js.Parser();
              const results = await parser.parseStringPromise(xmlData);
              this[key] = results.nodes.node;
          }
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
