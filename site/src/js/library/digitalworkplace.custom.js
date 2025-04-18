import { blogDetailWidget_callbacks } from './modules/callbacks/BlogDetailWidget.js';
import { eventDetailWidget_callbacks } from './modules/callbacks/EventDetailWidget.js'
import { internalPagesWidget_callbacks } from './modules/callbacks/InternalPagesWidget.js'
import { latestMediaWidget_callbacks } from './modules/callbacks/LatestMediaWidget.js';
import { newsDetailWidget_callbacks } from './modules/callbacks/NewsDetailWidget.js';
import { peopleDirectoryWidget_callbacks } from './modules/callbacks/PeopleDirectoryWidget.js';
import { employeeDetailWidget_handlebars } from './modules/handlebars/EmployeeDetailWidget.js';
import { latestMediaWidget_handlebars } from './modules/handlebars/LatestMediaWidget.js';

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

// Run our handlebars functions for templates to make use of
employeeDetailWidget_handlebars();
latestMediaWidget_handlebars();

// Akumina requires that widget callbacks be on the window object: https://akumina.github.io/docs/Akumina-Widget-Callbacks
// Otherwise we would package them into a library in webpack to keep the global namespace clean

// Assign all keys under each object to the window object
Object.assign(window, blogDetailWidget_callbacks);
Object.assign(window, eventDetailWidget_callbacks);
Object.assign(window, internalPagesWidget_callbacks);
Object.assign(window, latestMediaWidget_callbacks);
Object.assign(window, newsDetailWidget_callbacks);
Object.assign(window, peopleDirectoryWidget_callbacks);
