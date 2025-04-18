import { nciProfileInfo } from "../helpers/NciProfileInfo";

const internalPages_ui_prepContacts = function (widget, _props) {
  nciProfileInfo.updateProfileLinks(widget)
};

export const internalPagesWidget_callbacks = {
  internalPages_ui_prepContacts,
}
