import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';

/**
 * Represents an extraction of content from the Drupal 7 site
 *
 */

class DrupalContent {
  /**
   * Load content from XML export.
   *
   * @param {string} file A local filename for reading content from.
   */
  async loadContent(file) {
    try {
      // TBD: Reference actual files
      const filePath = './__mocks/export_content.xml';
      const xmlData = await fsPromises.readFile(filePath);

      const parser = new xml2js.Parser();
      const results = await parser.parseStringPromise(xmlData);

      console.log(results.nodes);
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

export default DrupalContent;
