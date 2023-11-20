import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
    this.FormDigestValue = null;
  }

  /**
   * 
   * Submits a batch request with the provided request contents.
   *  
   * @param {Array<Object>} batchItems 
   */ 
  async batchRequest(batchItems) {
    let formDigestValue = await this.getFormDigestValue();
    let batchGuid = uuidv4();
    let changesetGuid = uuidv4();
    let batchUrl = `${this.siteURL}/_api/$batch`;

    const SPClient = await this.client;
    const headers = SPClient.headers;

    var batchContents = new Array();

    batchItems.forEach((item) => {
      batchContents.push('--changeset_' + changesetGuid);
      batchContents.push('Content-Type: application/http');
      batchContents.push('Content-Transfer-Encoding: binary');
      batchContents.push('');
      batchContents.push('POST ' + item.url + ' HTTP/1.1');
      batchContents.push('Content-Type: application/json;odata=verbose');
      batchContents.push('');
      batchContents.push(item.body);
      batchContents.push('');
    });
    batchContents.push('--changeset_' + changesetGuid + '--'); // close out the last changeset

    // generate the body of the batch
    var batchBody = batchContents.join('\r\n');

    // start with a clean array
    batchContents = new Array();

    // create batch for creating items
    batchContents.push('--batch_' + batchGuid);
    batchContents.push(
      `Content-Type: multipart/mixed; boundary="changeset_${changesetGuid}"`
    );
    batchContents.push('Host: nih.sharepoint.com');
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push(batchBody);
    batchContents.push('--batch_' + batchGuid + '--');

    batchBody = batchContents.join('\r\n');

    headers['Content-Type'] = `multipart/mixed; boundary=batch_${batchGuid}`;
    headers['Host'] = 'nih.sharepoint.com';
    headers['X-RequestDigest'] = formDigestValue;
    headers['Content-Length'] = batchBody.length;

    let response = await this.axios({
      method: 'post',
      url: batchUrl,
      headers: headers,
      data: batchBody,
    });

    console.log(response);
    return response;

  }

  // standard method to get form digests for POST requests
  async getFormDigestValue() {
    if (this.FormDigestValue === null) {
      try {
        const SPClient = await this.client;
        const headers = SPClient.headers;
        headers['Accept'] = 'application/json;odata=verbose';

        let response = await this.axios({
          method: 'post',
          url: `${this.siteURL}/_api/contextinfo`,
          headers: headers,
          data: {},
        });

        // Return just the internal digest value
        this.FormDigestValue =
          response.data.d.GetContextWebInformation.FormDigestValue;
      } catch (error) {
        this.handleSPerror(error, 'Error getting form digest value');
      }
    } else {
      console.log("Used cached form digest value;");
    }
    return this.FormDigestValue;
  }

  // Method for handling errors
  handleSPerror(error, errorMessage) {
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
      throw new Error(errorMessage);
    }
  }
}

export default SPBase;
