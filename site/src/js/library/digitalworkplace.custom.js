// NCI-162: Added to speed application of theme to reduce visual inconsistencies on load
var AdditionalSteps = AdditionalSteps || {};
if ((typeof AdditionalSteps.MoreSteps) === 'undefined') {
    AdditionalSteps.MoreSteps = {
        Init: function () {
          $("body").addClass("ak-theme-ncitheme");  // Node if theme changes, this ref will need to change.
            var steps = [];
            return steps;
        }
    }
}


Handlebars.registerHelper('SearchProperty', function (itemCells, prop, options) {
    for (var i = 0; i < itemCells.length; i++)
                   if (prop.toLowerCase() == itemCells[i].Name.toLowerCase())
                                  return itemCells[i].Value;
    return "";
});

Handlebars.registerHelper('OrganizationSpaces', function (organization) {
	if (typeof organization == 'string') {
		var spacedOrg = organization.replaceAll('/', ' / ');
		return spacedOrg;
	} else {
		return organization;
	}
});

Handlebars.registerHelper("ThumbnailImage", function (image, options) {
    if (image != null && image.toLowerCase().indexOf("akumina%20library") == -1){
        var imageSegments = image.split("/");
        imageSegments.splice(imageSegments.length - 1, 0, "_t");
        var fileName = imageSegments[imageSegments.length - 1].toLowerCase();
        var fileNameSegments = fileName.split('.');
        var fileExtValue = fileNameSegments[fileNameSegments.length - 1];
        var fileExtValueSegments = fileExtValue.split("&");
        var fileExt = fileExtValueSegments[0];
        fileName = fileName.replace("." + fileExt,"_" + fileExt + ".jpg");
        imageSegments[imageSegments.length - 1] =  fileName;
        image = imageSegments.join("/");
    }
    return image
});

Handlebars.registerHelper("MediumThumbnailImage", function (image, exclusion, options) {
    if (image != null && image.toLowerCase().indexOf("akumina%20library") == -1){
        var imageSegments = image.split("/");
        imageSegments.splice(imageSegments.length - 1, 0, "_w");
        var fileName = imageSegments[imageSegments.length - 1];
        var fileNameSegments = fileName.toLowerCase().split('.');
        var fileExtValue = fileNameSegments[fileNameSegments.length - 1];
        var fileExtValueSegments = fileExtValue.split("&");
        var fileExt = fileExtValueSegments[0];
        var useThumbnail = true;
        if (exclusion != null && Array.isArray(exclusion)){ // check excluded extensions
            var onExclusionList = $.inArray(fileExt, exclusion) > -1;
            useThumbnail = !onExclusionList;
        }
        if (useThumbnail){
            fileName = fileName.replace("." + fileExt,"_" + fileExt + ".jpg");
            imageSegments[imageSegments.length - 1] =  fileName;
            image = imageSegments.join("/");
        }
    }
    return image
});

Handlebars.registerHelper('formatAddress', function(text) {
    // Replace all occurrences of $ with a line break
    return new Handlebars.SafeString(text.replace(/\$/g, '<br>'));
});

window.FireWhen = function(id, condition, callback, testInterval) {
	if (condition == null){
		return;
	}
	var conditionMet = condition();
	if (conditionMet) {
		clearTimeout(window[id]);
		Akumina.AddIn.Logger.WriteInfoLog('FireWhen:conditionMet:' + id);
		callback.apply(this, Array.prototype.slice.call(arguments, 4));
	} else {
		clearTimeout(window[id]);
		window[id] = window.setTimeout(function(args) {
			window.FireWhen.apply(this, args);
		}, testInterval, arguments);
	}
};


window.NCIAddDebuggerBreak = function (arg1, arg2, arg3, arg4, arg5) {
    debugger;
}

window.NCINewsDetailUICallback  = function(widget, props) {
	var profInfo1 = $('#profInfoLink1');
    var profInfo2 = $('#profInfoLink2');
    var profPhoto1 = $('#profPhotoLink2');
    var profPhoto2 = $('#profPhotoLink2');
    
    if (profInfo1.length > 0 && profPhoto1.length > 0) {
        GetNCIProfileInfoUrl("#profInfoLink1");
        GetNCIProfilePictureUrl("#profPhotoLink1"); 
    }
    if (profInfo2.length > 0 && profPhoto2.length > 0) {
        GetNCIProfileInfoUrl("#profInfoLink2");
        GetNCIProfilePictureUrl("#profPhotoLink2"); 
    }
}

window.NewsDetailContactCallback = function(data) {
    var profInfo1 = $('#profInfoLink1');
    var profInfo2 = $('#profInfoLink2');
    var profPhoto1 = $('#profPhotoLink2');
    var profPhoto2 = $('#profPhotoLink2');
    var contact1Elements = [profInfo1, profPhoto1];
    var contact2Elements = [profInfo2, profPhoto2];
    
    if (profInfo1.length > 0 && profPhoto1.length > 0) {
        contact1Elements.forEach(function(profElement){
            profElement.attr('data-manager', data.newsarticle.NCIContactPerson1.EMail);
        });
    }
    if (profInfo2.length > 0 && profPhoto2.length > 0) {
        contact2Elements.forEach(function(profElement){
            profElement.attr('data-manager', data.newsarticle.NCIContactPerson2.EMail);
        });
    }
	return data;
}

window.GetNCIProfileInfoUrl = function(targetId) { 
    var emailUpn = $(targetId).attr('data-manager');
    if (typeof emailUpn == 'string') {
        Akumina.Digispace.Utilities.GetEmployeeDetailUrl(emailUpn).then((newUrl) => {
            var pathPart = newUrl.substring(newUrl.toLowerCase().lastIndexOf("/sitepages"));
            var completeUrl = AkHeadlessUrl + "/#" + pathPart;
            $(targetId).attr("href", completeUrl);
        });
    }
}


window.GetNCIProfilePictureUrl = function(targetId) {
    var emailUpn = $(targetId).attr('data-manager');
    if (typeof emailUpn == 'string') {
        var newUrl = Akumina.Digispace.Utilities.GetUserPictureUrl(emailUpn);
        newUrl = "url(" + newUrl + ")";
        $(targetId).css("background-image", newUrl);
    }
}


window.Client = typeof window.Client === "object" ? window.Client : {};

function InitializeSlider() {
    
    new Slider({
        images: '.slider-1 img',
        btnPrev: '.slider-1 .buttons .prev',
        btnNext: '.slider-1 .buttons .next',
        auto: true,
        rate: 5000
    });
}


function Slider(obj) {
    this.images = $(obj.images);
    this.auto = obj.auto;
    this.btnPrev = obj.btnPrev;
    this.btnNext = obj.btnNext;
    this.rate = obj.rate || 1000;

    var i = 0;
    var slider = this;

    // The "Previous" button: to remove the class .shoved, show the previous image and add the .shoved class
    this.prev = function () {
        slider.images.eq(i).removeClass('shown');
        i--;

        if (i < 0) {
            i = slider.images.length - 1;
        }
        slider.images.eq(i).addClass('shown');
    }

    // The "Next" button: to remove the class .shoved, show the next image and add the .shoved class
    this.next = function () {
        slider.images.eq(i).removeClass('shown');
        i++;

        if (i >= slider.images.length) {
            i = 0;
        }
        slider.images.eq(i).addClass('shown');
    }

    // To add next and prev functions when clicking the corresponding buttons
    $(slider.btnPrev).on('click', function () {slider.prev(); });
    $(slider.btnNext).on('click', function () { slider.next(); });

    // For the automatic slider: this method calls the next function at the set rate
    if (slider.auto) {
        setInterval(slider.next, slider.rate);
    }
};

// This inserts the Adobe script link into the DOM
var script = document.createElement('script');
script.setAttribute('async', 'async');
if (_configContextInfo["adobe-analytics-tracker"] != null) {
    script.setAttribute('src', _configContextInfo["adobe-analytics-tracker"]);
    document.head.prepend(script);
}
else if(window.location.host == "mynci-preprod.cancer.gov") {
    script.setAttribute('src', 'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-54f3716fa1f1-development.min.js');
    document.head.prepend(script);
}
else if(window.location.host == "mynci.cancer.gov") {
    script.setAttribute('src', 'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-8c72e1b653fe.min.js');
    document.head.prepend(script);
}
else {
    script.setAttribute('src', 'https://assets.adobedtm.com/6a4249cd0a2c/cbc52400d29b/launch-54f3716fa1f1-development.min.js');
    document.head.prepend(script);
}

window.NCITABOrganizationDirectory = function(control,properties)
{
    PushPeopleContainerUnderTab();
}

window.PushPeopleContainerUnderTab = function()
{
    if($(".ia-people-results").length == 1) {
        $(".ia-people-results").clone(true).appendTo($('#ak-tabwidget-tabs-PeopleTab'));
    }
    else {
        var ua = window.navigator.userAgent;
        var isFF = !!ua.match(/Firefox/i);
        // if browser is firefox we need to correct the scrolling when viewing more people
        if (isFF) {
            var profiles = $('.ia-profile-container.ia-card');
            // divide by 2 for hidden profile containers and - 10 to account for new containers just added
            var offset = $(profiles[profiles.length/2 - 10]);
            // to get last container's position
            offset = offset.offset();
            // to scroll to that spot
            $('html, body').stop().animate({
                scrollTop: offset.top
            }, 100);
        }
    }
}


window.NCIDescriptionProcessed = '';
window.NCIFlatDepartmentstree = [];
window.NCIGenericItemPropcallback = function(prop)
{ 
    prop.idOrTitle =  NCIDescriptionProcessed || "";
    var selectedNodes = $('#filtertreenav').jstree('get_selected');
    if (selectedNodes.length === 0 || typeof(selectedNodes[0]) === 'object') {
        var param = decodeURIComponent(Akumina.AddIn.Utilities.getQueryStringParameter("d", ""));
        if (param != "") 
        {
            prop.idOrTitle =  param;
        }
    }
     prop.listName = "GenericHTML_AK";     
     prop.selectFields = "Body";
     prop.useFriendlyUrl = false
     return prop;
}

window.NCIGenericSearchPropcallback = function(request)
{
    request.searchTerm = $('.jstree-clicked').text();
    request.defaultQueryText = `*  (SPSiteURL:${Akumina.Digispace.SiteContext.SiteAbsoluteUrl} (((FileExtension:zip OR FileExtension:txt OR FileExtension:doc OR FileExtension:docx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:pdf)(IsDocument:\"True\")) OR (contentclass:\"STS_ListItem\" Path:\"${Akumina.Digispace.SiteContext.SiteAbsoluteUrl}/Lists/*\" AkLanguageId:1033))) 	DEPARTMENTS:\"${$('.jstree-clicked').text()}\"`;
    return request.defaultQueryText;
};

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

window.OrganizationDirectorySearchResultsCallBack  = function(data)
{
    data.SearchTerm = $('.jstree-clicked').length>0 ? $('.jstree-clicked').text():"";
    return data;
}


window.NCITreeNavSelected = '';


//OrganizationDirectoryPage
window.LoadOrganizationDirectoryTreeFilter = function() {

    var organizationtermsetid = _configContextInfo.hasOwnProperty("organizationdirectorytermsetid") && !Akumina.AddIn.Utilities.IsNullOrEmpty(_configContextInfo.organizationdirectorytermsetid)? _configContextInfo.organizationdirectorytermsetid : "";
    
    if(Akumina.AddIn.Utilities.IsNullOrEmpty(organizationtermsetid)){
        $('#organizationdirectorytabwidget').html("Missing configuration organizationtermsetid.");
        return;
    }
    
    // Dynamically add the link to jsTree CSS
    var cssLink = $('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/themes/default/style.min.css">');
    $('head').append(cssLink);

    // Add truncate class
    FireWhen("truncate", function() {
        return $('.jstree-anchor').length > 0;
    }, function() {
        $('.jstree-anchor').addClass('truncate');
        $('.jstree-anchor').each(function() {
            var description = $(this).text();
            $(this).attr('title', description);
        });
        $('.jstree-children').each(function() {
            $(this).parent().bind('click', function() {
                $('.jstree-anchor').addClass('truncate');
                //bindfiltertrigger();
            });
            $('.jstree-anchor').each(function() {
                var description = $(this).text();
                $(this).attr('title', description);
            });
        });
        //bindfiltertrigger();
        var truncateTimmer = setInterval(function() {
            if (!$('.jstree-anchor').hasClass('truncate')) {
                $('.jstree-anchor').addClass('truncate');
            }
        }, 100);
    }, 200);

    
    $('#filtertreenav').on("select_node.jstree", function (e, data) 
    {                
        // Remove the existing 'jstree-clicked' class from all nodes
        $('.jstree-clicked').removeClass('jstree-clicked');

        // Add 'jstree-clicked' class to the selected node's anchor element
        $(data.event.currentTarget).addClass('jstree-clicked');
    
        // Get the node text
        var description = data.node.text.replace('＆', '&');
    
        // Tab People
        if ($('[aria-controls="ak-tabwidget-tabs-PeopleTab"]').length > 0 && $('[aria-controls="ak-tabwidget-tabs-PeopleTab"]').hasClass('ia-tab-active')) {
            var customAttr = data.node.original.customAttr;            
            if(!Akumina.AddIn.Utilities.IsNullOrEmpty(customAttr))
            {
                description = customAttr;                
            }
            NCIDescriptionProcessed = description;
            $('.ia-people-filter-options [type=checkbox]').prop('checked', false);
            if ($(`.ia-checkbox-wrapper [value="${description}"]`).length > 0) {
                $(`.ia-checkbox-wrapper [value="${description}"]`).click();
            } else {
                $('.ia-people-results').html(Akumina.Digispace.Language.TryGetText("peoplelist.noresultsfound"));
            }
        }
        // Overview Tab (first tab)
        else if ($('.ak-tabwidget-tabs-container li:first').hasClass('ia-tab-active')) {
            var customAttr = data.node.original.customAttr;            
            if(!Akumina.AddIn.Utilities.IsNullOrEmpty(customAttr))
            {
                description = customAttr;                
            }
            NCIDescriptionProcessed = description;
            var id = $('.ak-tabwidget-tabs-container li:first').attr('aria-controls');
            RenderChildWidgets(`#${id}`);
        }
        // Another Overview Tab (last tab)
        else if ($('.ak-tabwidget-tabs-container li:last').hasClass('ia-tab-active')) {
            Akumina.Digispace.AppPart.Eventing.Publish("/genericsearchlist/search/", { term: `${description}` });
        }

        NCITreeNavSelected = description;
        
    });
    

    function convertToJsTreeData(term) {
        
        var node = {
            id: term.Id,
            text: term.Name,
            customAttr: term.Labels.length >1 ? term.Labels[1].Value : "" ,
            children: []
        };
        
        if(term.Labels.length >1)
            {
                
                var item =
                {
                    Id: term.Id,
                    text: term.Name,
                    Labels: term.Labels                
                };    
                NCIFlatDepartmentstree.push(item);
            }     

        if (term.Children && term.Children.length > 0) {
            for (var i = 0; i < term.Children.length; i++) {
                node.children.push(convertToJsTreeData(term.Children[i]));
                if(term.Children[i].Labels.length >1){
                    NCIFlatDepartmentstree.push(term.Children[i]);
                }                
            }
        }

        return node;
    }  

    // Load jsTree script and initialize
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js", async function(data, textStatus, jqxhr) {        
        var deliveryUrl = Akumina.Digispace.ConfigurationContext.RemoteListSiteUrl;
        var termsetId = _configContextInfo.organizationdirectorytermsetid;
        var url = Akumina.Digispace.ConfigurationContext.InterchangeURL + `/api/nci/gettermsfromtermset?termsetId=${termsetId}&siteUrl=${deliveryUrl}`;
        $.ajax({
                type: "GET",
                url: url,
                headers: {
                    "X-Akumina-QueryKey": Akumina.Digispace.ConfigurationContext.InterchangeQueryKey
                },
                contentType: 'application/json; charset=utf-8',
                xhrFields: {
                    withCredentials: true
                },
                success: function (response) {
                    
                    var jsTreeData = response.terms.filter(function(e){return e.Name=='Departments'})[0].Children.map(convertToJsTreeData);
                    
                    $('#filtertreenav').jstree({
                        'core': {
                            'data': jsTreeData
                        }
                    });
                    //Workaround to fix issue related to nested items not loading correctly
                    
                    
                    //NCI-202 - Links to Organization
                    $('#filtertreenav').on('ready.jstree', function (e, data) {
                        $('#filtertreenav').jstree('open_all');
                        $('#filtertreenav').jstree('close_all');
                    
                        var param = decodeURIComponent(Akumina.AddIn.Utilities.getQueryStringParameter("d", ""));
                        if (param != "") {
                            var department = NCIFlatDepartmentstree.filter(function (e) {
                                return e.Labels[1].Value.toLowerCase() == param.toLowerCase()
                            });
                            if (department.length > 0) {
                                var departmentId = department[0].Id;
                                $('#filtertreenav').jstree('activate_node', departmentId);
                                simulateClickOnSelectedNode()
                            }
                        }
                    });
                    
                    },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('error getting termset ->' + termsetid);
                    $('#organizationdirectorytabwidget').html('error getting termset ->' + termsetid);
                }
            });

    });
}
//OrganizationDirectoryPage
window.NCIDirectoryOrgCallBackUI = function()
{
    FireWhen("AddTabsUnderOrgWidget", function () {
        return $('.ia-tab-widget-container').length >0 && $('#organizationdirectorytabwidget').length > 0;
    }, function () {        
        $('.ia-tab-widget-container').appendTo($('#organizationdirectorytabwidget'));
        $('.ia-tab-widget-container').show();
        NCITABOrganizationDirectory();
          
    }, 200);                            
}

FireWhen("LoadTabWidget", function () {
    return $(".ia-people-results").length > 0 && $('#ak-tabwidget-tabs-PeopleTab').length > 0;
}, function () {
    $('.ui-tabs-anchor').bind('click',function()
    {
        
        var tabDescription = $(this).text().trim();
        switch(tabDescription) 
        {
            case "People":
                // Call this function to simulate the click                
                //Akumina.Digispace.AppPart.Eventing.Publish("/peopledirectory/search/", "facets");                
                var lastProcessed = $(this).attr('loaded') || "";
                if(lastProcessed=='' || NCIDescriptionProcessed != lastProcessed)
                {
                    $(this).attr('loaded',NCIDescriptionProcessed);
                    FireWhen("PeopleTabReady", function () {
                        return $("#ak-tabwidget-tabs-PeopleTab").hasClass('ia-tab-active-link');
                    }, function () {
                        simulateClickOnSelectedNode();    
                    }, 200);                                        
                }                
                break
            case "Content":
                var id = $('.ak-tabwidget-tabs-container li:first').attr('aria-controls');
                Akumina.Digispace.AppPart.Eventing.Publish("/genericsearchlist/search/", { term: `${NCITreeNavSelected}` });                    
                break
            case "Overview":
                var id = $('.ak-tabwidget-tabs-container li:first').attr('aria-controls');
                RenderChildWidgets(`#${id}`);
            break
        }   

    });    
}, 200);

// Simulate click on the current folder selected
function simulateClickOnSelectedNode() {
    // Get the selected node using jstree's get_selected method
    var selectedNode = $('#filtertreenav').jstree('get_selected', true)[0]; // true to get the full node object

    if (selectedNode) {
        // Find the anchor (<a>) element corresponding to the selected node
        var selectedAnchor = $('#' + selectedNode.id + '_anchor');
        
        // Trigger a click event on the anchor element
        selectedAnchor.trigger('click');
    } else {
        console.log('No node is currently selected.');
    }
}




window.On_Page_Loaded = function(){
   $('html').attr('lang', Akumina.Digispace.UserContext.LanguageCode.toLowerCase()); 
   NCIDescriptionProcessed ='';
}
Akumina.Digispace.AppPart.Eventing.Subscribe('/page/loaded/', window.On_Page_Loaded);

window.NCI_LatestMediaPhotos = function(widget, properties){
    if (window["NCI_LatestMediaPhotos_load"] == null){
        var prefix = Akumina.Digispace.ConfigurationContext.FrameworkCDNPrefix + "/fe/" + Akumina.Digispace.Version;
        var suffix = "?v=" + Akumina.Digispace.SiteContext.ImplementationVersion;
        var slickSliderUrl = prefix + "/vendor/slickslider.min.js" + suffix;
        (new Akumina.Digispace.Data.CacheManager).cachedScript(slickSliderUrl).then(function() {
            console.log("success loading " + slickSliderUrl);
        }, function(e) {
            console.log("error loading " + slickSliderUrl);
        })
        window["NCI_LatestMediaPhotos_load"] = true;
    }
    FireWhen("NCI_LatestMediaPhotos".toLocaleLowerCase(), function() {
        return jQuery().slick != null;
    }, function() {
        $(document).ready(function () {
            $('.featuredPhotosSlider').slick({
                dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
    
                speed: 500,
                fade: true,
                cssEase: 'linear',
    
                autoplay: true,
                autoplayspeed: 5000
            });
        });
    
    
        $('.ia-modal-inline-trigger-photo').magnificPopup({
            type: 'inline',
            preloader: false,
            closeBtnInside: true,
            showCloseBtn: true,
            fixedBgPos: true,
            mainClass: 'ak-photo-modal'
        });
        $('.ia-modal-inline-trigger-photo').on('click', function () {
            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        });
    }, 250);
}