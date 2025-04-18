import { nciProfileInfo } from "../helpers/NciProfileInfo";

const newsDetail_ui_prepContacts = function (widget, _props) {
  nciProfileInfo.updateProfileLinks(widget)
};

export const newsDetailWidget_callbacks = {
  newsDetail_ui_prepContacts,
}
