import { nciProfileInfo } from "../helpers/NciProfileInfo";
import { formatting } from "../helpers/Formatting";

const newsDetail_ui_prepContacts = function (widget, _props) {
  nciProfileInfo.updateProfileLinks(widget);
};

const newsDetail_data_changeDate = function (data) {
  if (data.newsarticle.publisheddate != '') {
    var formattedDate = formatting.dateFormat(data.newsarticle.Publish_x0020_Date);
    data.newsarticle.publisheddate = formattedDate;
  }
  
  return data;
}

export const newsDetailWidget_callbacks = {
  newsDetail_ui_prepContacts,
  newsDetail_data_changeDate,
}
