

/* START SAMPLES */
/*

var AdditionalSteps = AdditionalSteps || {};

//You can call "MoreSteps" anything you would like, as long as it is apart of the "AdditionalSteps" object
//You can also create multiples, ie  AdditionalSteps.MyAdvancedSteps, AdditionalSteps.SomethingElse, it will always run  AdditionalSteps.XXYY.Init()
if ((typeof AdditionalSteps.MoreSteps) === 'undefined') {

    AdditionalSteps.MoreSteps = {

        Init: function () {
            var steps = [];
            Akumina.AddIn.Logger.WriteInfoLog('AdditionalSteps.MoreSteps.Init');
            steps.push({ stepName: "Auto Clear Local Cache", additionalSteps: [{ name: "MyCustomStep", callback: MyCustomStep }]});
            steps.push({ stepName: "Fetching User Properties", additionalSteps: [{ name: "AddMyDataToUserContext", callback: AddMyDataToUserContext }]});
            return steps;
        }

    }

}
function MyCustomStep() {
    //do work
    Akumina.Digispace.Utilities.ShowAlertPopup("My Custom Step");
    //the framework will not go to the next step untill you fire this event, so you can get data from an endpoint if needed
    Akumina.Digispace.AppPart.Eventing.Publish('/loader/onexecuted/');

}

function AddMyDataToUserContext() {
    //do work
    Akumina.Digispace.Utilities.ShowAlertPopup("Add MyData ToUserContext");
    //stuff custom data into Digispace usercontext
    Akumina.Digispace.UserContext.MyCustomProperty = "Custom Value";
    //the framework will not go to the next step untill you fire this event, so you can get data from an endpoint if needed
    Akumina.Digispace.AppPart.Eventing.Publish('/loader/onexecuted/');

}



//Sample Custom Dashboard Widget
if ((typeof Akumina.AddIn.DummyDashboardWidget) === 'undefined') {
    Akumina.AddIn.DummyDashboardWidget = function () {
        var _cur = this;

        this.GetPropertyValue = function (requestIn, key, defaultValue) {
            var propertyValue = "";

            for (var prop in requestIn) {
                if (key.toLowerCase() == prop.toLowerCase()) {
                    propertyValue = requestIn[prop];
                    break;
                }
            }
            return (propertyValue == undefined || propertyValue.toString().trim() == "") ? defaultValue : propertyValue;
        };

        this.SetDefaultsProperties = function (request) {
            request.SenderId = _cur.GetPropertyValue(request, "id", "");
            request.WidgetMessage = _cur.GetPropertyValue(request, "WidgetMessage", "No message specified !");

            return request;
        };

        this.Init = function (dashboardWidgetRequest) {
            _cur.widgetRequest = _cur.SetDefaultsProperties(dashboardWidgetRequest);
        };

        this.PreRender = function () {
            var targetDiv = _cur.widgetRequest.SenderId;
            $("#" + targetDiv).html(Akumina.Digispace.ConfigurationContext.LoadingTemplateHtml);
            Akumina.Digispace.AppPart.Eventing.Subscribe('/loader/completed/', _cur.Render);
        };

        this.Render = function () {
            var targetDiv = _cur.widgetRequest.SenderId;
            $("#" + targetDiv).html(_cur.widgetRequest.WidgetMessage);
        };
    }
}

//Callback for Sample Rail Item

function helloWorldCallback(item) {
    var def = $.Deferred();
    var title = $(item).find('span.ak-nav-title').text();
    var railItemModel = {
        "Header": title, "RailItemContent": "Hello World Rail Item", "Footer": "Hello World Footer"
    };
    def.resolve(railItemModel);
    return def;
}

//Callback for Digispace Configuration Dashboard Widget based on Generic List Control
function DashboardShowConfiguration(data) {
    var configuration = {};
    configuration.Items = [];

    for (var i = 0; i < data.Items.length; i++) {
        configuration.Items.push({ Key: data.Items[i].Title, Value: data.Items[i].Value });
    }

    configuration.HasItems = configuration.Items.length > 0;

    return configuration;
}

if ((typeof Akumina.AddIn.DigispaceConfigurationWidget) === 'undefined') {
    Akumina.AddIn.DigispaceConfigurationWidget = function () {
        var _cur = this;

        this.GetPropertyValue = function (propertyValue, defaultValue) {
            return (propertyValue == undefined || propertyValue.toString().trim() == "") ? defaultValue : propertyValue;
        };

        //Set any property overrides here
        this.SetDefaultsProperties = function (request) {
            request.callbackMethod = "DashboardShowConfiguration";
            request.callbackType = "postdataload";
            request.CacheInterval = "0";
            request.listName = "DigispaceConfigurationIDS_AK";
            request.displayTemplateUrl = _cur.GetPropertyValue(request.displaytemplateurl, "");
            request.SenderId = _cur.GetPropertyValue(request.SenderId, "");
            return request;
        };

        this.Init = function (dashboardWidgetRequest) {
            _cur.widgetRequest = _cur.SetDefaultsProperties(dashboardWidgetRequest);
            _cur.genericListControl = new Akumina.AddIn.GenericListControlWidget();
            _cur.genericListControl.Init(_cur.widgetRequest);
        };

        this.Render = function () {
            _cur.genericListControl.Render();
        };
    }
}

//<div id="randomguid" class="ak-controls ak-mycustom-widget" ak:test="value"></div>
//Akumina.Digispace.AppPart.Eventing.Subscribe('/loader/eventsubscription/', initMyCustomWidget);

if ((typeof Akumina.AddIn.MyCustomWidget) === 'undefined') {
    Akumina.AddIn.MyCustomWidget = function () {
        var _cur = this;

        this.Init = function (properties) {
            this.properties = properties;
            _cur.Prerender();
        };

        this.Prerender = function () {
            $("#" + _cur.properties.id).html(Akumina.Digispace.Language.GetText("common.loading"));
            Akumina.Digispace.AppPart.Eventing.Subscribe('/loader/completed/', _cur.Render);
        };

        this.Render = function () {

            $("#" + _cur.properties.id).html("Akumina.AddIn.Custom.MyCustomWidget has loaded!! WOW!!!! Here is your property: " + _cur.properties.test);

        };
    }
}


function initMyCustomWidget() {

    $('.ak-mycustom-widget').each(function (index) {
        var props = Akumina.AddIn.Utilities.getProperties($(this));
        var myCustomWidget = new Akumina.AddIn.MyCustomWidget();
        myCustomWidget.Init(props);
    });
}

//old home[age dept news logic callbacks

function GetDepartmentNewsFromSite(listRequest, def) {
    var siteName = listRequest.site;

    var utils = Akumina.AddIn.Utilities;
    var web;
    var context = new SP.ClientContext(Akumina.Digispace.SiteContext.SiteServerRelativeUrl + "/" + siteName);//.get_current();

    web = context.get_web();

    var list = web.get_lists().getByTitle(listRequest.listName);
    var camlQuery = new SP.CamlQuery();
    var query = listRequest.viewXml;
    if (utils.IsNullOrEmpty(query)) {
        query = "<View><Query><OrderBy><FieldRef Name=\"Created\" Ascending=\"False\"></FieldRef></OrderBy></Query><RowLimit>4</RowLimit></View>";
    }
    camlQuery.set_viewXml(query);
    listRequest.listItems = list.getItems(camlQuery);
    if (!utils.IsNullOrEmpty(listRequest.selectFields)) {
        context.load(listRequest.listItems, 'Include(' + listRequest.selectFields + ')');
    } else {
        listRequest.listFields = list.get_fields();
        context.load(listRequest.listFields);
        context.load(listRequest.listItems);
    }
    Akumina.AddIn.Logger.logSPCall('GetDepartmentNewsFromSite site: ' + siteName);
    context.executeQueryAsync(
        Function.createDelegate(me, function () { GetDepartmentNewsSuccesshandler(listRequest, def); }),
        Function.createDelegate(me, function (sender, args) {
            Akumina.AddIn.Logger.WriteErrorLog('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            GetDepartmentNewsErrorhandler(listRequest, def);
        })
    );
}

function GetDepartmentNewsSuccesshandler(listRequest, def) {
    var siteName = listRequest.site;
    var listEnumerator = listRequest.listItems.getEnumerator();
    Akumina.AddIn.Logger.WriteInfoLog('GetDepartmentNewsSuccesshandler' + siteName);
    var data = {};
    data.Items = [];

    while (listEnumerator.moveNext()) {
        var item = {
        };
        var listItem = listEnumerator.get_current();
        if (typeof listRequest.listFields != 'undefined') {
            var fields = listRequest.listFields.getEnumerator();
            while (fields.moveNext()) {
                var fieldName = fields.get_current().get_staticName();
                if (!Akumina.AddIn.Configuration.containsInExcludeField(fieldName)) {// containsInExcludeFieldForGenericItem(fieldName)) {
                    item[fieldName] = listItem.get_item(fieldName);
                }
            }
        }
        else {
            var fields = listRequest.selectFields.split(',');
            for (var i = 0; i < fields.length; i++) {
                var fieldName = fields[i];
                if (!Akumina.AddIn.Configuration.containsInExcludeField(fieldName)) {
                    item[fieldName] = listItem.get_item(fieldName);
                }
            }
        }
        item =
            {
                "Title": item["Title"],
                "Department": Akumina.Digispace.UserContext.Department,
                "Image": item["Image"] != null ? item["Image"].get_url() : '',
                "Link": item["FriendlyUrl"],
            }

        if (!data.FirstItem) {
            item.IsFirstItem = true;
            data.FirstItem = item;
        }
        else {
            item.IsFirstItem = false;
            data.Items.push(item);
        }
    }
    data.HasItems = data.Items.length > 0 ? true : false;
    data.UserDepartment = Akumina.Digispace.UserContext.Department;

    var result = {
        response: data, request: listRequest
    };
    def.resolve(result);
};

function GetDepartmentNewsErrorhandler(listRequest, def) {
    var data = {};
    var siteName = listRequest.site;
    data.Items = [];
    data.UserDepartment = siteName;
    var result = {
        response: data, request: listRequest
    };
    def.resolve(result);
};
*/
/* END SAMPLES */
