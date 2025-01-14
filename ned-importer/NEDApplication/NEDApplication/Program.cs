#region Namespace Imports


using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Xml;


#endregion


public class NEDApplication
{


    static async Task Main()
    {
        var response = GetByUrlAsync();
        Task.WhenAll(response);
        var data = response.Result;
        string city = GetValueFromXml("//ns0:Locality", data.ToString());
        string faxNumber = GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Fax']", data.ToString());
        string jobTitle = GetValueFromXml("//ns0:Title", data.ToString());
        string postalCode = GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:PostalCode", data.ToString());
        string streetAddress = GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Street", data.ToString());
        string telephoneNumber = GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", data.ToString());
        string userPrincipalName = GetValueFromXml("//ns0:NIHSSO/ns0:SSOUsername", data.ToString());
        string companyName = GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgName", data.ToString());
        string department = GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOUName", data.ToString());
        string displayName = GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:FormattedName)", data.ToString());
        string givenName = GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:GivenName)", data.ToString());
        string mail = GetValueFromXml("//ns0:EmailAddresses/ns0:EmailAddress[@ns0:EmailAddressType='Preferred'])", data.ToString());
        string officeLocation = GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']", data.ToString());
        string state = GetValueFromXml("//ns0:Addresses/ns0:[@ns0:AddressType='Office']/ns0:State", data.ToString());
        string surname = GetValueFromXml("//ns0:Names/ns0:Name[@NameType='Legal']/ns0:Surname", data.ToString());
        string businessPhones = GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", data.ToString());
        string country = GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Country", data.ToString());
        string otherMails = GetValueFromXml("//ns0:EmailAddresses", data.ToString());
        string customFieldString1 = GetValueFromXml("//ns0:UniqueIdentifier", data.ToString());
        string customFieldString2 = GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgPath", data.ToString());
        string customFieldString3 = GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOUAcronym", data.ToString());
        string customFieldString4 = GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOUName", data.ToString());

        // Dump extracted results to console
        Console.WriteLine("City: " + city);
        Console.WriteLine("Fax Number: " + faxNumber);
        Console.WriteLine("Job Title: " + jobTitle);
        Console.WriteLine("Postal Code: " + postalCode);
        Console.WriteLine("Street Address: " + streetAddress);
        Console.WriteLine("Telephone Number: " + telephoneNumber);
        Console.WriteLine("User Principal Name: " + userPrincipalName);
        Console.WriteLine("Company Name: " + companyName);
        Console.WriteLine("Department: " + department);
        Console.WriteLine("Display Name: " + displayName);
        Console.WriteLine("Given Name: " + givenName);
        Console.WriteLine("Mail: " + mail);
        Console.WriteLine("Office Location: " + officeLocation);
        Console.WriteLine("State: " + state);
        Console.WriteLine("Surname: " + surname);
        Console.WriteLine("Business Phones: " + businessPhones);
        Console.WriteLine("Country: " + country);
        Console.WriteLine("Other Mails: " + otherMails);
        Console.WriteLine("CustomFieldString1 (Uniqueidentifier): " + customFieldString1);
        Console.WriteLine("CustomFieldString2 (NIHOrgPath): " + customFieldString2);
        Console.WriteLine("CustomFieldString3 (NIHOUAcronym): " + customFieldString3);
        Console.WriteLine("CustomFieldString4 (NIHOUName): " + customFieldString4);
    }


    static string GetValueFromXml(string searchValue, string xml)
    {
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(xml);

        XmlNodeList phoneNumbers = doc.SelectNodes(searchValue, GetNamespaceManager(doc));
        if (phoneNumbers.Count > 0)
        {
            return phoneNumbers[0].InnerText;
        }
        return null;
    }


    public async static Task<string> GetByUrlAsync ()
    {
        using (HttpClient client = new HttpClient())
        {
            // Set up basic authentication
            //var byteArray = System.Text.Encoding.ASCII.GetBytes($"{username}:{password}");
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
            // Set a longer timeout (for example, 5 minutes)
            var URLTest = "https://samplenonclient.blob.core.windows.net/ncisandbox/ned-api-by-email.xml";
            client.Timeout = TimeSpan.FromMinutes(5);
            // Make a request to the Workday API
            HttpResponseMessage response = await client.GetAsync(URLTest);

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
    }


    static XmlNamespaceManager GetNamespaceManager(XmlDocument doc)
    {
        XmlNamespaceManager nsManager = new XmlNamespaceManager(doc.NameTable);
        nsManager.AddNamespace("ns0", "http://www.nih.gov/NEDPersonV7");
        return nsManager;
    }
}