export function GetNCIProfileInfoUrl(targetId) {
    var emailUpn = $(targetId).attr('data-manager');
    if (typeof emailUpn == 'string') {
      Akumina.Digispace.Utilities.GetEmployeeDetailUrl(emailUpn).then(
        (newUrl) => {
          var pathPart = newUrl.substring(
            newUrl.toLowerCase().lastIndexOf('/sitepages')
          );
          var completeUrl = AkHeadlessUrl + '/#' + pathPart;
          $(targetId).attr('href', completeUrl);
        }
      );
    }
}
  
  // Used in NewsDetail, CalendarDetail, and InternalPages

export function GetNCIProfilePictureUrl(targetId) {
  var emailUpn = $(targetId).attr('data-manager');
  if (typeof emailUpn == 'string') {
    var newUrl = Akumina.Digispace.Utilities.GetUserPictureUrl(emailUpn);
    newUrl = 'url(' + newUrl + ')';
    $(targetId).css('background-image', newUrl);
  }
}
