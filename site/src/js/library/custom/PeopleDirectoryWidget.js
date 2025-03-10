window.NCITABOrganizationDirectory = function (control, properties) {
  PushPeopleContainerUnderTab();
};

window.PushPeopleContainerUnderTab = function () {
  if ($('.ia-people-results').length == 1) {
    $('.ia-people-results')
      .clone(true)
      .appendTo($('#ak-tabwidget-tabs-PeopleTab'));
  } else {
    var ua = window.navigator.userAgent;
    var isFF = !!ua.match(/Firefox/i);
    // if browser is firefox we need to correct the scrolling when viewing more people
    if (isFF) {
      var profiles = $('.ia-profile-container.ia-card');
      // divide by 2 for hidden profile containers and - 10 to account for new containers just added
      var offset = $(profiles[profiles.length / 2 - 10]);
      // to get last container's position
      offset = offset.offset();
      // to scroll to that spot
      $('html, body').stop().animate(
        {
          scrollTop: offset.top,
        },
        100
      );
    }
  }
};

window.NCIDescriptionProcessed = '';
window.NCIFlatDepartmentstree = [];
window.NCIGenericItemPropcallback = function (prop) {
  prop.idOrTitle = NCIDescriptionProcessed || '';
  var selectedNodes = $('#filtertreenav').jstree('get_selected');
  if (selectedNodes.length === 0 || typeof selectedNodes[0] === 'object') {
    var param = decodeURIComponent(
      Akumina.AddIn.Utilities.getQueryStringParameter('d', '')
    );
    if (param != '') {
      prop.idOrTitle = param;
    }
  }
  prop.listName = 'GenericHTML_AK';
  prop.selectFields = 'Body';
  prop.useFriendlyUrl = false;
  return prop;
};

window.NCIGenericSearchPropcallback = function (request) {
  request.searchTerm = $('.jstree-clicked').text();
  request.defaultQueryText = `*  (SPSiteURL:${
    Akumina.Digispace.SiteContext.SiteAbsoluteUrl
  } (((FileExtension:zip OR FileExtension:txt OR FileExtension:doc OR FileExtension:docx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:pdf)(IsDocument:\"True\")) OR (contentclass:\"STS_ListItem\" Path:\"${
    Akumina.Digispace.SiteContext.SiteAbsoluteUrl
  }/Lists/*\" AkLanguageId:1033))) 	DEPARTMENTS:\"${$(
    '.jstree-clicked'
  ).text()}\"`;
  return request.defaultQueryText;
};

window.OrganizationDirectorySearchResultsCallBack = function (data) {
  data.SearchTerm =
    $('.jstree-clicked').length > 0 ? $('.jstree-clicked').text() : '';
  return data;
};

window.NCITreeNavSelected = '';

//OrganizationDirectoryPage
window.LoadOrganizationDirectoryTreeFilter = function () {
  var organizationtermsetid =
    _configContextInfo.hasOwnProperty('organizationdirectorytermsetid') &&
    !Akumina.AddIn.Utilities.IsNullOrEmpty(
      _configContextInfo.organizationdirectorytermsetid
    )
      ? _configContextInfo.organizationdirectorytermsetid
      : '';

  if (Akumina.AddIn.Utilities.IsNullOrEmpty(organizationtermsetid)) {
    $('#organizationdirectorytabwidget').html(
      'Missing configuration organizationtermsetid.'
    );
    return;
  }

  // Dynamically add the link to jsTree CSS
  var cssLink = $(
    '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/themes/default/style.min.css">'
  );
  $('head').append(cssLink);

  // Add truncate class
  FireWhen(
    'truncate',
    function () {
      return $('.jstree-anchor').length > 0;
    },
    function () {
      $('.jstree-anchor').addClass('truncate');
      $('.jstree-anchor').each(function () {
        var description = $(this).text();
        $(this).attr('title', description);
      });
      $('.jstree-children').each(function () {
        $(this)
          .parent()
          .bind('click', function () {
            $('.jstree-anchor').addClass('truncate');
            //bindfiltertrigger();
          });
        $('.jstree-anchor').each(function () {
          var description = $(this).text();
          $(this).attr('title', description);
        });
      });
      //bindfiltertrigger();
      var truncateTimmer = setInterval(function () {
        if (!$('.jstree-anchor').hasClass('truncate')) {
          $('.jstree-anchor').addClass('truncate');
        }
      }, 100);
    },
    200
  );

  $('#filtertreenav').on('select_node.jstree', function (e, data) {
    // Remove the existing 'jstree-clicked' class from all nodes
    $('.jstree-clicked').removeClass('jstree-clicked');

    // Add 'jstree-clicked' class to the selected node's anchor element
    $(data.event.currentTarget).addClass('jstree-clicked');

    // Get the node text
    var description = data.node.text.replace('＆', '&');

    // Tab People
    if (
      $('[aria-controls="ak-tabwidget-tabs-PeopleTab"]').length > 0 &&
      $('[aria-controls="ak-tabwidget-tabs-PeopleTab"]').hasClass(
        'ia-tab-active'
      )
    ) {
      var customAttr = data.node.original.customAttr;
      if (!Akumina.AddIn.Utilities.IsNullOrEmpty(customAttr)) {
        description = customAttr;
      }
      NCIDescriptionProcessed = description;
      $('.ia-people-filter-options [type=checkbox]').prop('checked', false);
      if ($(`.ia-checkbox-wrapper [value="${description}"]`).length > 0) {
        $(`.ia-checkbox-wrapper [value="${description}"]`).click();
      } else {
        $('.ia-people-results').html(
          Akumina.Digispace.Language.TryGetText('peoplelist.noresultsfound')
        );
      }
    }
    // Overview Tab (first tab)
    else if (
      $('.ak-tabwidget-tabs-container li:first').hasClass('ia-tab-active')
    ) {
      var customAttr = data.node.original.customAttr;
      if (!Akumina.AddIn.Utilities.IsNullOrEmpty(customAttr)) {
        description = customAttr;
      }
      NCIDescriptionProcessed = description;
      var id = $('.ak-tabwidget-tabs-container li:first').attr('aria-controls');
      RenderChildWidgets(`#${id}`);
    }
    // Another Overview Tab (last tab)
    else if (
      $('.ak-tabwidget-tabs-container li:last').hasClass('ia-tab-active')
    ) {
      Akumina.Digispace.AppPart.Eventing.Publish('/genericsearchlist/search/', {
        term: `${description}`,
      });
    }

    NCITreeNavSelected = description;
  });

  function convertToJsTreeData(term) {
    var node = {
      id: term.Id,
      text: term.Name,
      customAttr: term.Labels.length > 1 ? term.Labels[1].Value : '',
      children: [],
    };

    if (term.Labels.length > 1) {
      var item = {
        Id: term.Id,
        text: term.Name,
        Labels: term.Labels,
      };
      NCIFlatDepartmentstree.push(item);
    }

    if (term.Children && term.Children.length > 0) {
      for (var i = 0; i < term.Children.length; i++) {
        node.children.push(convertToJsTreeData(term.Children[i]));
        if (term.Children[i].Labels.length > 1) {
          NCIFlatDepartmentstree.push(term.Children[i]);
        }
      }
    }

    return node;
  }

  // Load jsTree script and initialize
  $.getScript(
    'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js',
    async function (data, textStatus, jqxhr) {
      var deliveryUrl =
        Akumina.Digispace.ConfigurationContext.RemoteListSiteUrl;
      var termsetId = _configContextInfo.organizationdirectorytermsetid;
      var url =
        Akumina.Digispace.ConfigurationContext.InterchangeURL +
        `/api/nci/gettermsfromtermset?termsetId=${termsetId}&siteUrl=${deliveryUrl}`;
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'X-Akumina-QueryKey':
            Akumina.Digispace.ConfigurationContext.InterchangeQueryKey,
        },
        contentType: 'application/json; charset=utf-8',
        xhrFields: {
          withCredentials: true,
        },
        success: function (response) {
          var jsTreeData = response.terms
            .filter(function (e) {
              return e.Name == 'Departments';
            })[0]
            .Children.map(convertToJsTreeData);

          $('#filtertreenav').jstree({
            core: {
              data: jsTreeData,
            },
          });
          //Workaround to fix issue related to nested items not loading correctly

          //NCI-202 - Links to Organization
          $('#filtertreenav').on('ready.jstree', function (e, data) {
            $('#filtertreenav').jstree('open_all');
            $('#filtertreenav').jstree('close_all');

            var param = decodeURIComponent(
              Akumina.AddIn.Utilities.getQueryStringParameter('d', '')
            );
            if (param != '') {
              var department = NCIFlatDepartmentstree.filter(function (e) {
                return e.Labels[1].Value.toLowerCase() == param.toLowerCase();
              });
              if (department.length > 0) {
                var departmentId = department[0].Id;
                $('#filtertreenav').jstree('activate_node', departmentId);
                simulateClickOnSelectedNode();
              }
            }
          });
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log('error getting termset ->' + termsetid);
          $('#organizationdirectorytabwidget').html(
            'error getting termset ->' + termsetid
          );
        },
      });
    }
  );
};
//OrganizationDirectoryPage
window.NCIDirectoryOrgCallBackUI = function () {
  FireWhen(
    'AddTabsUnderOrgWidget',
    function () {
      return (
        $('.ia-tab-widget-container').length > 0 &&
        $('#organizationdirectorytabwidget').length > 0
      );
    },
    function () {
      $('.ia-tab-widget-container').appendTo(
        $('#organizationdirectorytabwidget')
      );
      $('.ia-tab-widget-container').show();
      NCITABOrganizationDirectory();
    },
    200
  );
};

FireWhen(
  'LoadTabWidget',
  function () {
    return (
      $('.ia-people-results').length > 0 &&
      $('#ak-tabwidget-tabs-PeopleTab').length > 0
    );
  },
  function () {
    $('.ui-tabs-anchor').bind('click', function () {
      var tabDescription = $(this).text().trim();
      switch (tabDescription) {
        case 'People':
          // Call this function to simulate the click
          //Akumina.Digispace.AppPart.Eventing.Publish("/peopledirectory/search/", "facets");
          var lastProcessed = $(this).attr('loaded') || '';
          if (lastProcessed == '' || NCIDescriptionProcessed != lastProcessed) {
            $(this).attr('loaded', NCIDescriptionProcessed);
            FireWhen(
              'PeopleTabReady',
              function () {
                return $('#ak-tabwidget-tabs-PeopleTab').hasClass(
                  'ia-tab-active-link'
                );
              },
              function () {
                simulateClickOnSelectedNode();
              },
              200
            );
          }
          break;
        case 'Content':
          var id = $('.ak-tabwidget-tabs-container li:first').attr(
            'aria-controls'
          );
          Akumina.Digispace.AppPart.Eventing.Publish(
            '/genericsearchlist/search/',
            { term: `${NCITreeNavSelected}` }
          );
          break;
        case 'Overview':
          var id = $('.ak-tabwidget-tabs-container li:first').attr(
            'aria-controls'
          );
          RenderChildWidgets(`#${id}`);
          break;
      }
    });
  },
  200
);

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
