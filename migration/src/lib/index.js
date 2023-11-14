import * as spauth from 'node-sp-auth';
import SPList from './entities/list.js';

/**
 * Represents a SharePoint API client.
 */
class SharePointClient {
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

    this.client = spauth.getAuth(siteURL, {
      clientId: clientId,
      clientSecret: clientSecret,
    });
    this.siteURL = siteURL;
  }

  /**
   * Gets the sites category.
   */
  get list() {
    return new SPList(this.client, this.siteURL);
  }
}

export default SharePointClient;
