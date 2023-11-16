import axios from 'axios';

/**
 * Represents a SharePoint entity (item, etc.).
 */
class SPBase {
  /**
   * Creates a new instance of SPItems
   *
   * @param {SPClient} client A SharePoint client from node-sp-auth.
   * @param {string} siteURL The base SharePoint URL.
   */
  constructor(client, siteURL) {
    this.client = client;
    this.siteURL = siteURL;
    this.axios = axios;
  }

  // standard method to get form digests for POST requests
  async getFormDigestValue() {
    try {
      const SPClient = await this.client;
      const headers = SPClient.headers;
      headers['Accept'] = 'application/json;odata=verbose';

      let response = await this.axios({
        method: 'post',
        url: `${this.siteURL}_api/contextinfo`,
        headers: headers,
        data: {},
      });

      // Return just the internal digest value
      return response.data.d.GetContextWebInformation.FormDigestValue;
    } catch (error) {
      throw new Error('Error getting form digest value');
    }
  }

  // Method for handling errors
  handleSPerror(error) {
    if (error.response && error.response.data) {
      const statusCode = error.response.status || 'Unknown status';
      const statusText = error.response.statusText || '';
      const errorMessage =
        error.response.data.error.message.value || 'Unknown error message';

      throw new Error(
        `SharePoint: (${statusCode} - ${statusText}): ${errorMessage}`
      );
    } else {
      // Handle other types of errors or Axios errors without a response
      console.error('Error:', error);
      throw new Error('An error occurred while communicating with SharePoint');
    }
  }
}

export default SPBase;
