// NCI-162: Added to speed application of theme to reduce visual inconsistencies on load
var AdditionalSteps = AdditionalSteps || {};
if (typeof AdditionalSteps.MoreSteps === 'undefined') {
  AdditionalSteps.MoreSteps = {
    Init: function () {
      $('body').addClass('ak-theme-ncitheme'); // Note if theme changes, this ref will need to change.
      var steps = [];
      return steps;
    },
  };
}