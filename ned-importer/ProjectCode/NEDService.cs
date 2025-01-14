#region Namespace Imports


using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Xml;


#endregion Namespace Imports


namespace NCI.PeopleSync.Customization
{


    class NEDService
    {

        private static HttpClient _httpClient;
        static int _HttpTimeout = 60;
        static string _NEDApiBaseUrl = string.Empty;
        static string _NEDApiAADPart = string.Empty;
        static string _NEDApiSupervisorPart = string.Empty;
        static string _username = string.Empty;
        static string _password = string.Empty;


        static NEDService()
        {
            _NEDApiBaseUrl = "####"; // TO-DO from OCPL: move this to configuration; stripped from code for now
            _NEDApiAADPart = "/NEDPERSONREST?ADAccount=";
            _NEDApiSupervisorPart = "/NEDPERSONREST?NIHId=";
            _username = "####"; // TO-DO from OCPL: move this to configuration; stripped from code for now
            _password = "####"; // TO-DO from OCPL: move this to configuration; stripped from code for now

            // Setup and configure our one HTTP client
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(_NEDApiBaseUrl);

            //Setup up basic authentication
            var byteArray = System.Text.Encoding.ASCII.GetBytes($"{_username}:{_password}");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            // Set a longer timeout (for example, 5 minutes)
            _httpClient.Timeout = TimeSpan.FromMinutes(_HttpTimeout);
        }


        public async Task<string> FetchSupervisorFromNED(string supervisorId)
        {

            // Make a request to the NED API
            HttpResponseMessage response =
                await _httpClient.GetAsync($"{_NEDApiBaseUrl}{_NEDApiSupervisorPart}{supervisorId}");

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Read and process the response content
                string responseData = await response.Content.ReadAsStringAsync();
                return responseData;
            }
            else
            {
                // Handle the error
                Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                return "";
            }
        }


        public async Task<string> FetchUserFromNED(string aadAccountName)
        {

            // Make a request to the NED API
            HttpResponseMessage response = await _httpClient.GetAsync($"{_NEDApiBaseUrl}{_NEDApiAADPart}{aadAccountName}");

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Read and process the response content
                string responseData = await response.Content.ReadAsStringAsync();
                return responseData;
            }
            else
            {
                // Handle the error
                Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                return "";
            }
        }


        public static string GetValueFromXml(string xpathSearch, string xml)
        {
            XmlNodeList xpathNodes;
            string returnVal;
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            xpathNodes = doc.SelectNodes(xpathSearch, GetNamespaceManager(doc));
            if (null == xpathNodes || xpathNodes.Count == 0)
            {
                returnVal = null;
            }
            else
            {
                returnVal = xpathNodes[0].InnerText.Length > 0 ? xpathNodes[0].InnerText : null;
            }

            return returnVal;
        }


        public static XmlNamespaceManager GetNamespaceManager(XmlDocument doc)
        {
            XmlNamespaceManager nsManager = new XmlNamespaceManager(doc.NameTable);
            nsManager.AddNamespace("ns0", "http://www.nih.gov/NEDPersonV7");
            return nsManager;
        }
    }
}
