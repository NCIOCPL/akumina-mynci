function getInfoUrl(target) {
  var $target = $(target); // make sure it's a jQuery object
  var emailUpn = $target.attr('data-email-id');
  if (typeof emailUpn === 'string') {
    Akumina.Digispace.Utilities.GetEmployeeDetailUrl(emailUpn).then((newUrl) => {
      var pathPart = newUrl.substring(
        newUrl.toLowerCase().lastIndexOf('/sitepages')
      );
      var completeUrl = AkHeadlessUrl + '/#' + pathPart;
      $target.attr('href', completeUrl);
    });
  }
}

function getPhotoUrl(target) {
  var $target = $(target); // make sure it's a jQuery object
  var emailUpn = $target.attr('data-email-id');
  if (typeof emailUpn === 'string') {
    var newUrl = Akumina.Digispace.Utilities.GetUserPictureUrl(emailUpn);
    $target.css('background-image', `url(${newUrl})`);
  }
}

export const nciProfileInfo = {
  updateProfileLinks: function (widget) {
    var $widget = $(widget); // make sure it's a jQuery object

    // Update any links to point to the correct profile page
    var profInfoLinks = $widget.find('.nci-profile-info-link');
    profInfoLinks.each(function (index, profElement) {
      getInfoUrl(profElement);
    });

    // Update any photo divs with the background image
    var profPhotoLinks = $widget.find('.nci-profile-photo-link');
    profPhotoLinks.each(function (index, profElement) {
      getPhotoUrl(profElement);
    });
  }
};
