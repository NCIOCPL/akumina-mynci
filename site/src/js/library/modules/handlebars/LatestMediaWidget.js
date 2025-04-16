export function latestMediaWidget_handlebars() {
  Handlebars.registerHelper('ThumbnailImage', function (image, _options) {
    if (
      image != null &&
      image.toLowerCase().indexOf('akumina%20library') == -1
    ) {
      var imageSegments = image.split('/');
      imageSegments.splice(imageSegments.length - 1, 0, '_t');
      var fileName = imageSegments[imageSegments.length - 1].toLowerCase();
      var fileNameSegments = fileName.split('.');
      var fileExtValue = fileNameSegments[fileNameSegments.length - 1];
      var fileExtValueSegments = fileExtValue.split('&');
      var fileExt = fileExtValueSegments[0];
      fileName = fileName.replace('.' + fileExt, '_' + fileExt + '.jpg');
      imageSegments[imageSegments.length - 1] = fileName;
      image = imageSegments.join('/');
    }
    return image;
  });

  // Used with the Latest Media Widget / ncifeaturedphotos.html view
  Handlebars.registerHelper(
    'MediumThumbnailImage',
    function (image, _exclusion, _options) {
      if (
        image != null &&
        image.toLowerCase().indexOf('akumina%20library') == -1
      ) {
        var imagePath = image.split('relativeurl=')[1];
        //var useThumbnail = true;
        //if (exclusion != null && Array.isArray(exclusion)){ // check excluded extensions
        //    var onExclusionList = $.inArray(fileExt, exclusion) > -1;
        //    useThumbnail = !onExclusionList;
        //}
        //if (useThumbnail){

        // To-Do: Change the tenant URL to reference a variable
        image =
          'https://nih.sharepoint.com/_layouts/15/getpreview.ashx?path=' +
          imagePath +
          '&resolution=0';
        //}
      }
      return image;
    }
  );

}
