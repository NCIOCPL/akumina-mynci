import { formatting } from "../helpers/Formatting";
/**
 * Data callback for Blog Detail Widget. Does the following:
 *
 * - Updates displayed date field to be the actual date
 *
 * @param {object} data The widget data after being retrieved from SharePoint
 * @returns {object} Updated widget data
 */
const blogDetail_data_changeDate = function (data) {
  if (data.newsarticle.publisheddate != '') {
    var formattedDate = formatting.dateFormat(data.newsarticle.Publish_x0020_Date);
    data.newsarticle.publisheddate = formattedDate;
  }
  
  return data;
};

export const blogDetailWidget_callbacks = {
  blogDetail_data_changeDate
}
