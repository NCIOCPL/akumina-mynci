using Akumina.Common.Enums;
using Akumina.DataHub.Web.Api.Controllers;
using Akumina.Interchange.Core.Factory;
using Akumina.Interchange.Core.Interfaces;
using Akumina.Interchange.Services;
using Akumina.Interchange.Web.Utility.Filters;
using Akumina.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Service.Api.Controllers
{
    [RoutePrefix("api/nci")]
    public class NCIController : BaseApiOAuth2Controller
    {

        [HttpGet]
        [AkQueryKey]
        [Route("gettermsfromtermset")]
        [AkExecutionTime]
        public async Task<HttpResponseMessage> GetTermsFromTermSet(Guid termsetId, string siteUrl)
        {
            try
            {
                var token = await GetAccessToken(ResourceType.SharePoint, siteUrl);
                var termStoreService = new NCIService();
                termStoreService.SpAccessToken = token;
                termStoreService.SpCurrentSiteUrl = siteUrl;
                var response = await termStoreService.GetTermsFromTermSet(termsetId);
                var queryResponse = JsonConvert.SerializeObject(response);
                var httpResponse = Request.CreateResponse(HttpStatusCode.OK);
                httpResponse.Content = new StringContent(queryResponse, Encoding.UTF8, "application/json");
                return httpResponse;
            }
            catch (Exception ex)
            {
                TraceEvents.Log.Error(ex);
                return CreateErrorResponse(ex);
            }
        }

    }
}
