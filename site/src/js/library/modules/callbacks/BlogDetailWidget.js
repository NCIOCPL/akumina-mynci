export function blogDetailWidget_callbacks() {
  /**
   * Data callback for Blog Detail Widget. Does the following:
   *
   * - Updates displayed date field to be the actual date
   *
   * @param {object} data The widget data after being retrieved from SharePoint
   * @returns {object} Updated widget data
   */
  window.blogDetail_data_changeDate = function (data) {
    // Update article published date from "X days ago" to actual date
    if (data.newsarticle.publisheddate != '') {
      const date = new Date(data.newsarticle.Publish_x0020_Date);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      data.newsarticle.publisheddate = date.toLocaleDateString(
        'en-US',
        options
      );
    }

    return data;
  };
}
