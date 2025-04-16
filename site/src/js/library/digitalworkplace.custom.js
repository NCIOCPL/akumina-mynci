import { blogDetailWidget_callbacks } from './modules/callbacks/BlogDetailWidget.js';
import { employeeDetailWidget_handlebars } from './modules/handlebars/EmployeeDetailWidget.js';
import { newsDetailWidget_callbacks } from './modules/callbacks/NewsDetailWidget.js';
import { peopleDirectoryWidget_callbacks } from './modules/callbacks/PeopleDirectoryWidget.js';
import { latestMediaWidget_handlebars } from './modules/handlebars/LatestMediaWidget.js';
import { latestMediaWidget_callbacks } from './modules/callbacks/LatestMediaWidget.js';

// Remove in future
// window.NCIAddDebuggerBreak = function (arg1, arg2, arg3, arg4, arg5) {
//     debugger;
// }

window.GetNCIProfileInfoUrl = function (targetId) {
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
};

// Used in NewsDetail, CalendarDetail, and InternalPages
window.GetNCIProfilePictureUrl = function (targetId) {
  var emailUpn = $(targetId).attr('data-manager');
  if (typeof emailUpn == 'string') {
    var newUrl = Akumina.Digispace.Utilities.GetUserPictureUrl(emailUpn);
    newUrl = 'url(' + newUrl + ')';
    $(targetId).css('background-image', newUrl);
  }
};

window.Client = typeof window.Client === 'object' ? window.Client : {};

// This inserts the Adobe script link into the DOM
var script = document.createElement('script');
script.setAttribute('async', 'async');
if (_configContextInfo['adobe-analytics-tracker'] != null) {
  script.setAttribute('src', _configContextInfo['adobe-analytics-tracker']);
  document.head.prepend(script);
}

//top nav clickable text
/*
clearInterval(megamenuAnchorClickTimer);
var megamenuAnchorClickTimer = setInterval(function(){
	//var menuAnchorSelectionString = '.ia-mega-menu-wrapper .ia-mega-menu .ia-menu-level-1 .ia-menu-level-1-link>a';
	//var menuAnchorSelectionString = '.ia-mega-menu-wrapper .ia-mega-menu .ia-menu-level-1>li:has(.ia-menu-submenu-wrapper) .ia-menu-level-1-link>a';
	var menuAnchorSelectionString = '.ia-mega-menu-wrapper .ia-mega-menu .ia-menu-level-1>li:has(.ia-menu-submenu-wrapper) .ia-menu-level-1-link>a:not(.is-clickable)';
	
    //var menuAnchorNeedsReset = true;
    //if($(menuAnchorSelectionString+'.is-clickable').length > 0){
	//	menuAnchorNeedsReset = false;
	//}
    //if(menuAnchorNeedsReset == true){
    
	if($(menuAnchorSelectionString).length > 0){
        $(menuAnchorSelectionString).attr("href","javascript:void(0)");
		$(menuAnchorSelectionString).click(function(){
			$(this).parent().children('span').children('i').click();	
		});
		$(menuAnchorSelectionString).addClass('is-clickable');
	}
}, 100);
//top nav clickable text
*/

// Accessibility fix to add lang attribute
window.On_Page_Loaded = function () {
  $('html').attr(
    'lang',
    Akumina.Digispace.UserContext.LanguageCode.toLowerCase()
  );
};
Akumina.Digispace.AppPart.Eventing.Subscribe(
  '/page/loaded/',
  window.On_Page_Loaded
);

blogDetailWidget_callbacks();
employeeDetailWidget_handlebars();
newsDetailWidget_callbacks();
peopleDirectoryWidget_callbacks();
latestMediaWidget_handlebars();
latestMediaWidget_callbacks();
