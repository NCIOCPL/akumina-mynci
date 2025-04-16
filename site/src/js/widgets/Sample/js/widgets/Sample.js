export function Sample() {
  var _cur = this;
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
  this.SetDefaultsProperties = function (requestIn) {
    var requestOut = requestIn;
    requestOut.SenderId = _cur.GetPropertyValue(requestIn, 'id', '');
    requestOut.DisplayTemplateUrl = _cur.GetPropertyValue(
      requestIn,
      'displaytemplateurl',
      ''
    );
    requestOut.Test = _cur.GetPropertyValue(requestIn, 'test', '');
    return requestOut;
  };
  //"Init" is the main function called from the framework, everything else is specific to this widget
  this.Init = function (properties) {
    _cur.properties = _cur.SetDefaultsProperties(properties);
    _cur.properties.EditMode = Akumina.AddIn.Utilities.getEditMode();
    //wire up events
    _cur.Prerender();
  };
  this.Prerender = function () {
    var targetDiv = _cur.properties.SenderId;
    $('#' + targetDiv).html(
      Akumina.Digispace.ConfigurationContext.LoadingTemplateHtml
    );
    //subscribe to loader completed event, this is fired at the end of the DWP page lifecycle
    Akumina.Digispace.AppPart.Eventing.Subscribe(
      '/loader/completed/',
      _cur.Render,
      _cur.properties.SenderId
    );
    //subscribe to refresh event, called by Widget Manager on DWP
    Akumina.Digispace.AppPart.Eventing.Subscribe(
      '/widget/updated/',
      _cur.RefreshWidget,
      _cur.properties.SenderId
    );
  };
  this.Render = function () {
    var request = {};
    request.listName = 'Apps_AK';
    request.selectFields = 'Title';
    //setting legacyMode to true means it will perform JSOM (ProcessQuery)
    var legacyMode = true;
    var spcaller = new Akumina.Digispace.Data.DataFactory(legacyMode);
    spcaller.GetList(request).then(function (data) {
      var Items = [];
      var listEnumerator = data.response.listItems.getEnumerator();
      while (listEnumerator.moveNext()) {
        var listItem = listEnumerator.get_current();
        var item = {};
        item.Title = listItem.get_item('Title');
        Items.push(item);
      }
      data.Items = Items;
      data.Listname = request.listName;
      if (!_cur.properties.EditMode) {
        _cur.BindTemplate(
          _cur.properties.DisplayTemplateUrl,
          data,
          _cur.properties.SenderId
        );
      }
    });
  };
  this.RefreshWidget = function (newProps) {
    if (newProps['id'] == _cur.properties.SenderId) {
      _cur.properties = _cur.SetDefaultsProperties(newProps);
      _cur.Render();
    }
  };
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
};

//module.exports = Sample;
