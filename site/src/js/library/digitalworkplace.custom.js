import { blogDetailWidget_helper } from './modules/BlogDetailWidget.js';
import { employeeDetailWidget_helper } from './modules/EmployeeDetailWidget.js';
import { latestMediaWidget_helper } from './modules/LatestMediaWidget.js';
import { newsDetailWidget_helper } from './modules/NewsDetailWidget.js';
import { peopleDirectoryWidget_helper } from './modules/PeopleDirectoryWidget.js';

// Is this used?
Handlebars.registerHelper(
  'SearchProperty',
  function (itemCells, prop, options) {
    for (var i = 0; i < itemCells.length; i++)
      if (prop.toLowerCase() == itemCells[i].Name.toLowerCase())
        return itemCells[i].Value;
    return '';
  }
);

window.FireWhen = function (id, condition, callback, testInterval) {
  if (condition == null) {
    return;
  }
  var conditionMet = condition();
  if (conditionMet) {
    clearTimeout(window[id]);
    Akumina.AddIn.Logger.WriteInfoLog('FireWhen:conditionMet:' + id);
    callback.apply(this, Array.prototype.slice.call(arguments, 4));
  } else {
    clearTimeout(window[id]);
    window[id] = window.setTimeout(
      function (args) {
        window.FireWhen.apply(this, args);
      },
      testInterval,
      arguments
    );
  }
};

// Remove in future
// window.NCIAddDebuggerBreak = function (arg1, arg2, arg3, arg4, arg5) {
//     debugger;
// }

// window.GetNCIProfileInfoUrl = function (targetId) {
//   var emailUpn = $(targetId).attr('data-manager');
//   if (typeof emailUpn == 'string') {
//     Akumina.Digispace.Utilities.GetEmployeeDetailUrl(emailUpn).then(
//       (newUrl) => {
//         var pathPart = newUrl.substring(
//           newUrl.toLowerCase().lastIndexOf('/sitepages')
//         );
//         var completeUrl = AkHeadlessUrl + '/#' + pathPart;
//         $(targetId).attr('href', completeUrl);
//       }
//     );
//   }
// };

// // Used in NewsDetail, CalendarDetail, and InternalPages
// window.GetNCIProfilePictureUrl = function (targetId) {
//   var emailUpn = $(targetId).attr('data-manager');
//   if (typeof emailUpn == 'string') {
//     var newUrl = Akumina.Digispace.Utilities.GetUserPictureUrl(emailUpn);
//     newUrl = 'url(' + newUrl + ')';
//     $(targetId).css('background-image', newUrl);
//   }
// };

window.Client = typeof window.Client === 'object' ? window.Client : {};

// This inserts the Adobe script link into the DOM
var script = document.createElement('script');
script.setAttribute('async', 'async');
if (_configContextInfo['adobe-analytics-tracker'] != null) {
  script.setAttribute('src', _configContextInfo['adobe-analytics-tracker']);
  document.head.prepend(script);
} else if (window.location.host == 'mynci-preprod.cancer.gov') {
  script.setAttribute(
    'src',
    'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-54f3716fa1f1-development.min.js'
  );
  document.head.prepend(script);
} else if (window.location.host == 'mynci.cancer.gov') {
  script.setAttribute(
    'src',
    'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-8c72e1b653fe.min.js'
  );
  document.head.prepend(script);
} else {
  script.setAttribute(
    'src',
    'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-54f3716fa1f1-development.min.js'
  );
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

blogDetailWidget_helper();
employeeDetailWidget_helper();
latestMediaWidget_helper();
newsDetailWidget_helper();
peopleDirectoryWidget_helper();
