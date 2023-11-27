import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';
import URLConverter from './url-converter';

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
   * Delete all content from a SharePoint list.
   *
   * @param {string} listName A SharePoint list name.
   * @param {integer} batchSize Size of batches when looping
   * @param {Array<integer>} exclude A list of IDs to exclude
   */
  async truncateList(listName) {
    console.log('truncated!');
  }

  /**
   * Delete relevant content from the Akumina site
   *
   */
  async reset(listName) {
    // truncateList("a");
    // truncateList("b");
    // truncateList("c");
    console.log('reset!');
  }

  /**
   * Convert URLs
   *
   */
  async getURLConverter() {
    return new URLConverter();
  }
}

export default AkuminaSite;
