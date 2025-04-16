export function newsDetailWidget_callbacks() {
  // Rename in future
  // NewsDetailWidget_ui
  window.newsDetail_ui_prepSlider = function (_widget, _props) {
    var profInfo1 = $('#profInfoLink1');
    var profInfo2 = $('#profInfoLink2');
    var profPhoto1 = $('#profPhotoLink2');
    var profPhoto2 = $('#profPhotoLink2');

    if (profInfo1.length > 0 && profPhoto1.length > 0) {
      window.GetNCIProfileInfoUrl('#profInfoLink1');
      window.GetNCIProfilePictureUrl('#profPhotoLink1');
    }
    if (profInfo2.length > 0 && profPhoto2.length > 0) {
      window.GetNCIProfileInfoUrl('#profInfoLink2');
      window.GetNCIProfilePictureUrl('#profPhotoLink2');
    }
  };

  // Rename in future
  // NewsDetailWidget_data
  window.newsDetail_data_addContactInfo = function (data) {
    var profInfo1 = $('#profInfoLink1');
    var profInfo2 = $('#profInfoLink2');
    var profPhoto1 = $('#profPhotoLink2');
    var profPhoto2 = $('#profPhotoLink2');
    var contact1Elements = [profInfo1, profPhoto1];
    var contact2Elements = [profInfo2, profPhoto2];

    if (profInfo1.length > 0 && profPhoto1.length > 0) {
      contact1Elements.forEach(function (profElement) {
        profElement.attr(
          'data-manager',
          data.newsarticle.NCIContactPerson1.EMail
        );
      });
    }
    if (profInfo2.length > 0 && profPhoto2.length > 0) {
      contact2Elements.forEach(function (profElement) {
        profElement.attr(
          'data-manager',
          data.newsarticle.NCIContactPerson2.EMail
        );
      });
    }
    return data;
  };
}
