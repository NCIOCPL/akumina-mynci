var NCILeftNavWidget = function () {
  var _caseSensitiveUrlMatching = false;
  var _cur = this;
  var _cacheKeyForNavData = null;
  var _navList = null;
  var _rootSiteUrl = Akumina.Digispace.SiteContext.RootSiteUrl;

  this.BindTemplate = function (templateUri, data, targetDiv) {
    new Akumina.Digispace.AppPart.Data().Templates.ParseTemplate(
      templateUri,
      data
    ).done(function (html) {
      $('#' + targetDiv).html(html);
      Akumina.Digispace.AppPart.Eventing.Publish('/widget/loaded/', {
        properties: _cur.properties,
      });
    });
  };

  function CopyNavNode(navNode) {
    var newNavNode = [];
    newNavNode.DisplayOrder = navNode.DisplayOrder;
    newNavNode.Id = navNode.Id;
    newNavNode.LinkType = navNode.LinkType;
    newNavNode.LinkUrl = navNode.LinkUrl;
    newNavNode.NodeType = navNode.NodeType;
    newNavNode.ParentItemId = navNode.ParentItemId;
    newNavNode.Title = navNode.Title;
    return newNavNode;
  }

  function CreateLeftNavHierarchy(targetNavNode, navData) {
    var returnData = [];
    if (null != targetNavNode) {
      // Establish our root node (i.e., parent of targetNavNode)
      var workingNode = null;
      var levelOccupied = 1;
      navData.find((currentNode) => {
        if (currentNode.Id == targetNavNode.ParentItemId) {
          workingNode = CopyNavNode(currentNode);
        }
      });
      workingNode.IsSelectedNode = false;
      workingNode.NodeLevel = levelOccupied;
      returnData.push(workingNode);

      // Process 2nd through 4th levels of the hierarchy.
      while (levelOccupied < 5) {
        levelOccupied++;
        var currentResultSet = [];
        returnData.forEach((result) => {
          if (result.NodeLevel == levelOccupied - 1) {
            var intNode = CopyNavNode(result);
            intNode.NodeLevel = result.NodeLevel;
            intNode.IsSelectedNode =
              result.Id == targetNavNode.Id ? true : false;
            currentResultSet.push(intNode);
          }
        });
        for (
          let resultSetIdx = 0;
          resultSetIdx < currentResultSet.length;
          resultSetIdx++
        ) {
          var parentNode = currentResultSet[resultSetIdx];
          var childNodeArray = [];
          if (parentNode.NodeLevel == levelOccupied - 1) {
            for (let navIdx = 0; navIdx < navData.length; navIdx++) {
              if (navData[navIdx].ParentItemId == parentNode.Id) {
                var currentNavNode = CopyNavNode(navData[navIdx]);
                currentNavNode.IsSelectedNode =
                  navData[navIdx].Id == targetNavNode.Id ? true : false;
                currentNavNode.NodeLevel = levelOccupied;
                childNodeArray.push(currentNavNode);
              }
            }
            childNodeArray.sort((firstChild, secondChild) => {
              return firstChild.DisplayOrder <= secondChild.DisplayOrder;
            });
            if (childNodeArray.length > 0) {
              var newReturnArrayWithChildren = [];
              var lastArrayPart = [];
              var firstArrayPart = returnData.slice(0, resultSetIdx + 1);
              newReturnArrayWithChildren =
                firstArrayPart.concat(childNodeArray);
              if (resultSetIdx < currentResultSet.length - 1) {
                var lastArrayPart = returnData.slice(resultSetIdx + 1);
                lastArrayPart.forEach((addElement) => {
                  newReturnArrayWithChildren.push(addElement);
                });
              }
              returnData = newReturnArrayWithChildren;
            }
          }
        }
      }
      return returnData;
    }
  }

  this.FetchNavData = function () {
    var def = $.Deferred();
    var navData = Akumina.AddIn.Cache.Get(_cacheKeyForNavData);
    if (null != navData) {
      console.info('Navigational data retrieved from the Akumina Cache.');
      def.resolve(navData);
    } else {
      navData = [];
      var spRequest = {};
      spRequest.cacheRequest = false;
      spRequest.contextSiteUrl = _rootSiteUrl;
      spRequest.expandFields = 'ParentItem';
      spRequest.isRoot = true;
      spRequest.listName = _navList;
      spRequest.skipPersonaFiltering = true;
      spRequest.viewXml = `<View><Query><Where><Eq><FieldRef Name=\"Active\" /><Value Type=\"Boolean\">1</Value></Eq></Where></Query></View>`;
      var legacyMode = true;
      var spCaller = new Akumina.Digispace.Data.DataFactory(legacyMode);
      spCaller.GetList(spRequest).then(
        function (listData) {
          var listEnumerator = listData.response.listItems.getEnumerator();
          while (listEnumerator.moveNext()) {
            var listItem = listEnumerator.get_current();
            var navItem = {};
            navItem.Id = listItem.get_item('Id');
            navItem.Title = listItem.get_item('Title');
            navItem.DisplayOrder = listItem.get_item('DisplayOrder');
            var linkUrl =
              listItem.get_item('Link') && listItem.get_item('Link').get_url()
                ? listItem.get_item('Link').get_url()
                : '';
            navItem.LinkUrl = linkUrl;
            navItem.LinkType = listItem.get_item('LinkType');
            navItem.NodeType = listItem.get_item('NodeType');
            navItem.ParentItemId = listItem.get_item('ParentItemId');
            navData.push(navItem);
          }
          def.resolve(navData);
          Akumina.AddIn.Cache.Set(
            _cacheKeyForNavData,
            navData,
            _cur.GetCacheInterval
          );
          console.info(
            'Navigational data retrieved from "' +
              spRequest.listName +
              '" and added to the Akumina Cache.'
          );
        },
        function (error) {
          _cur.SPOperationFailure(error);
        }
      );
    }
    return def;
  };

  this.GetCacheInterval = function () {
    var validCacheInterval =
      typeof (_cur.properties.CacheInterval != 'undefined') &&
      _cur.properties.CacheInterval != null &&
      !isNaN(_cur.properties.CacheInterval);

    if (validCacheInterval) {
      if (_cur.properties.CacheInterval == -1) {
        return Akumina.Digispace.ConfigurationContext.CachingStrategyInterval;
      } else {
        return parseInt(_cur.properties.CacheInterval);
      }
    } else {
      return 0;
    }
  };

  this.GetCacheKey = function (key) {
    return Akumina.Digispace.ConfigurationContext.getCacheKey(
      _cur.properties.SenderId +
        ':' +
        Akumina.Digispace.PageContext.PageId +
        ':' +
        key
    );
  };

  this.GetPropertyValue = function (requestIn, key, defaultValue) {
    var propertyValue = '';
    for (var prop in requestIn) {
      if (key.toLowerCase() == prop.toLowerCase()) {
        propertyValue = requestIn[prop];
        break;
      }
    }
    return propertyValue == undefined || propertyValue.toString().trim() == ''
      ? defaultValue
      : propertyValue;
  };

  this.Init = function (properties) {
    _cur.properties = _cur.SetDefaultsProperties(properties);
    _cur.properties.EditMode = Akumina.AddIn.Utilities.getEditMode();
    _cacheKeyForNavData = _cur.GetCacheKey('NavigationData');
    _cacheKeyForPageLists = _cur.GetCacheKey('ListsWithPages');
    _cur.Prerender();
  };

  this.Prerender = function () {
    var targetDiv = _cur.properties.SenderId;
    $('#' + targetDiv).html(
      Akumina.Digispace.ConfigurationContext.LoadingTemplateHtml
    );
    Akumina.Digispace.AppPart.Eventing.Subscribe(
      '/loader/completed/',
      _cur.Render,
      _cur.properties.SenderId
    );
    Akumina.Digispace.AppPart.Eventing.Subscribe(
      '/widget/updated/',
      _cur.RefreshWidget,
      _cur.properties.SenderId
    );
  };

  this.RefreshWidget = function (newProps) {
    if (newProps['id'] == _cur.properties.SenderId) {
      _cur.properties = _cur.SetDefaultsProperties(newProps);
      _cur.Render();
    }
  };

  this.Render = function () {
    _cur.FetchNavData().then(function (navData) {
      var targetNavNode = null;
      var dataForView = {};

      // Look up the URL in our navigation data to see if there's a match with the links present. We're only
      // going to compare the relative path ()
      var currentPageRelUrl = location.href;
      if (currentPageRelUrl.substring('#') != -1) {
        currentPageRelUrl = location.href.substring(
          currentPageRelUrl.indexOf('#') + 1
        );
      }

      navData.find((currentNavElement) => {
        var matchUrl = currentNavElement.LinkUrl;
        if (matchUrl.indexOf('#') != -1) {
          matchUrl = matchUrl.substring(matchUrl.indexOf('#') + 1);
        }
        if (_caseSensitiveUrlMatching) {
          if (matchUrl.substring() == currentPageRelUrl) {
            targetNavNode = currentNavElement;
          }
        } else {
          if (matchUrl.toLowerCase() == currentPageRelUrl.toLowerCase()) {
            targetNavNode = currentNavElement;
          }
        }
      });

      // If we have a non-null nav node match, we'll continue to building out the nav hierarchy.
      dataForView.HasItems = null == targetNavNode ? false : true;
      if (dataForView.HasItems) {
        dataForView.Items = CreateLeftNavHierarchy(targetNavNode, navData);
      }

      // Bind the nav hierarchy (if there is one) to the view and display.
      dataForView.Loading = false;
      if (!_cur.properties.EditMode) {
        _cur.BindTemplate(
          _cur.properties.DisplayTemplateUrl,
          dataForView,
          _cur.properties.SenderId
        );
      }
    });
  };

  this.SetDefaultsProperties = function (requestIn) {
    var requestOut = requestIn;
    requestOut.DisplayTemplateUrl = _cur.GetPropertyValue(
      requestIn,
      'displaytemplateurl',
      ''
    );
    requestOut.SenderId = _cur.GetPropertyValue(requestIn, 'id', '');
    requestOut.NavList = _cur.GetPropertyValue(requestIn, 'navlist', '');
    requestOut.CaseSensitiveUrlMatching = _cur.GetPropertyValue(
      requestIn,
      'casecasesensetiveurlmatching',
      ''
    );
    _navList = requestOut.NavList;
    _caseSensitiveUrlMatching = requestOut.CaseSensitiveUrlMatching;
    return requestOut;
  };

  this.SPOperationFailure = function (spException) {
    console.error('      ERROR: ' + spException.error);
    console.error('     STATUS: ' + spException.status);
    console.error('    MESSAGE: ' + spException.message);
    console.error('STACK TRACE: ' + spException.stacktrace);
  };
};

module.exports = NCILeftNavWidget;
