import { nciProfileInfo } from "../helpers/NciProfileInfo";

const eventDetail_ui_prepContacts = function (widget, _props) {
  nciProfileInfo.updateProfileLinks(widget)
};

export const eventDetailWidget_callbacks = {
  eventDetail_ui_prepContacts,
}
