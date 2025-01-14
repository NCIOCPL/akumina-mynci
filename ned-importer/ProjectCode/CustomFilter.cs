#region  Namespace Imports


using Akumina.PeopleSync.Core;
using Akumina.PeopleSync.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;


#endregion Namespace Imports


namespace NCI.PeopleSync.Customization
{


    public class CustomFilter : ICustomFilter
    {


        #region Declarations (Static)


        private static Boolean _inInitialSleep = true;
        private static Int32 _debugSleepInternalInMs = 30000;


        #endregion Declarations (Static)


        #region Constructor (Private, Static)


        private static NEDService NEDService = new NEDService();
        public CustomFilter()
        {
            Console.WriteLine($"NCI Filter Version 1.0");
        }


        #endregion Constructor (Private, Static)

        
        #region Implmentation: ICustomFilter


        public object UserFilter(dynamic item)
        {

#if DEBUG
            if (_inInitialSleep)
            {
                ConsoleLogger.ShowInfo("  Sleeping the thread for " + (_debugSleepInternalInMs / 1000) + " seconds for debugger attach.");
                Thread.Sleep(_debugSleepInternalInMs);
                ConsoleLogger.ShowInfo("  Debugger attach interval over; proceeding with execution of filter.");
                _inInitialSleep = false;
            }
#endif

            var user = (Dictionary<string, object>)item;
            string aadAccountName;

            // Filter out users
            if (user.ContainsKey("userPrincipalName") && user["userPrincipalName"].ToString() != string.Empty)
            {
                Boolean importUserFlag = false;

                // We'll import Akumina.com users so we can test during development.
                var upn = user["userPrincipalName"].ToString();
                aadAccountName = upn.Substring(0, upn.IndexOf('@'));
                var NEDUser = NEDService.FetchUserFromNED(aadAccountName);
                Task.WhenAll(NEDUser);
                var userData = NEDUser.Result;

                // If we have an Akumina account, import them so debugging and runtime analysis is possible.
                if (!string.IsNullOrEmpty(upn) && upn.ToLower().Contains("akumina.com"))
                {
                    importUserFlag = true;
                }

                if (userData != null && (Convert.ToInt32(NEDService.GetValueFromXml("//ns0:NumberOfRecords", userData))) != 0)
                {
                    Console.WriteLine($"NED user '{aadAccountName}' found.");

                    // The next two checks need to be made before we start bringing in NED values.
                    var tempOL = user["officelocation"].ToString().ToUpper();
                    var tempDN = user["displayName"].ToString().ToUpper();
                    importUserFlag = (tempOL.StartsWith("NCI") || tempDN.IndexOf("NIH/NCI") != -1);
                    //Exception added for lindea@mail.nih.gov
                    if (aadAccountName.ToLower() == "lindea")
                    {
                        importUserFlag = true;
                    }
                    string city = NEDService.GetValueFromXml("//ns0:Locality", userData.ToString());
                    AddOrUpdateDictionary(user, "city", (!string.IsNullOrEmpty(city)) ? city : null);

                    string faxNumber = NEDService.GetValueFromXml("//ns0:PhoneNumber[@ns0:PhoneNumberType='Fax']", userData);
                    AddOrUpdateDictionary(user, "faxNumber", (!string.IsNullOrEmpty(faxNumber)) ? faxNumber : null);

                    string jobTitle = NEDService.GetValueFromXml("//ns0:Title", userData);
                    AddOrUpdateDictionary(user, "jobTitle", (!string.IsNullOrEmpty(jobTitle)) ? jobTitle : null);
                    AddOrUpdateDictionary(user, "jobTitle_keyword", (!string.IsNullOrEmpty(jobTitle)) ? jobTitle : null);

                    string postalCode = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:PostalCode", userData);
                    AddOrUpdateDictionary(user, "postalCode", (!string.IsNullOrEmpty(postalCode)) ? postalCode : null);

                    string streetAddress = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Street", userData);
                    AddOrUpdateDictionary(user, "streetAddress", (!string.IsNullOrEmpty(streetAddress)) ? streetAddress : null);

                    string companyName = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgName", userData);
                    AddOrUpdateDictionary(user, "companyName", (!string.IsNullOrEmpty(companyName)) ? companyName : null);

                    string department = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgPath", userData);
                    string departmentConverted = department.Replace(" ", " / ");
                    AddOrUpdateDictionary(user, "department", (!string.IsNullOrEmpty(departmentConverted)) ? departmentConverted : null);
                    AddOrUpdateDictionary(user, "department_keyword", (!string.IsNullOrEmpty(departmentConverted)) ? departmentConverted : null);                    

                    string displayName = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:FormattedName", userData);
                    AddOrUpdateDictionary(user, "displayName", (!string.IsNullOrEmpty(displayName)) ? displayName : null);

                    string givenName = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:GivenName", userData);
                    AddOrUpdateDictionary(user, "givenName", (!string.IsNullOrEmpty(givenName)) ? givenName : null);

                    string mail = NEDService.GetValueFromXml("//ns0:EmailAddresses/ns0:EmailAddress[@ns0:EmailAddressType='Preferred']", userData);
                    AddOrUpdateDictionary(user, "mail", (!string.IsNullOrEmpty(mail)) ? mail : null);

                    string officeLocation = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:FormattedAddress", userData);
                    AddOrUpdateDictionary(user, "officeLocation", (!string.IsNullOrEmpty(officeLocation)) ? officeLocation : null);

                    string state = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:State", userData);
                    AddOrUpdateDictionary(user, "state", (!string.IsNullOrEmpty(state)) ? state : null);

                    string surname = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@NameType='Legal']/ns0:Surname", userData);
                    AddOrUpdateDictionary(user, "surname", (!string.IsNullOrEmpty(surname)) ? surname : null);

                    string businessPhones = NEDService.GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", userData);
                    AddOrUpdateDictionary(user, "businessPhones", (!string.IsNullOrEmpty(businessPhones)) ? businessPhones : null);

                    string country = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Country", userData);
                    AddOrUpdateDictionary(user, "country", (!string.IsNullOrEmpty(country)) ? country : null);

                    string otherMails = NEDService.GetValueFromXml("//ns0:EmailAddresses", userData);
                    AddOrUpdateDictionary(user, "otherMails", (!string.IsNullOrEmpty(otherMails)) ? otherMails : null);

                    string customfieldstring1 = NEDService.GetValueFromXml("//ns0:Uniqueidentifier", userData);
                    AddOrUpdateDictionary(user, "customfieldstring1", (!string.IsNullOrEmpty(customfieldstring1)) ? customfieldstring1 : null);

                    string customfieldstring2 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgPath", userData);
                    AddOrUpdateDictionary(user, "customfieldstring2", (!string.IsNullOrEmpty(customfieldstring2)) ? customfieldstring2 : null);

                    string customfieldstring3 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgName", userData);
                    AddOrUpdateDictionary(user, "customfieldstring3", (!string.IsNullOrEmpty(customfieldstring3)) ? customfieldstring3 : null);

                    string customfieldstring4 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOUName", userData);
                    AddOrUpdateDictionary(user, "customfieldstring4", (!string.IsNullOrEmpty(customfieldstring4)) ? customfieldstring4 : null);

                    string telephoneNumber = NEDService.GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", userData);
                    AddOrUpdateDictionary(user, "customfieldstring5", (!string.IsNullOrEmpty(telephoneNumber)) ? telephoneNumber : null);

                    string employeeType = NEDService.GetValueFromXml("//ns0:EmployeeType", userData);
                    string employeeLetter = (string.IsNullOrEmpty(employeeType) ? null : employeeType.Substring(0, 1));
                    AddOrUpdateDictionary(user, "customfieldstring6", (!string.IsNullOrEmpty(employeeLetter)) ? employeeLetter : null);

                    // AAD doesn't have valid direct report data, and it can't be retrieved (at this point) from NED
                    AddOrUpdateDictionary(user, "DirectReports", String.Empty);

                    string supervisorId = NEDService.GetValueFromXml("//ns0:administrativeContact[@ns0:administrativeContactType='Supervisor']/ns0:HHSID", userData);
                    if (!string.IsNullOrEmpty(supervisorId) && importUserFlag)
                    {
                        Console.WriteLine($"  found supervisor reference for '{aadAccountName}.'");
                        var NEDSupervisor = NEDService.FetchSupervisorFromNED(supervisorId);
                        Task.WhenAll(NEDSupervisor);
                        var supervisorData = NEDSupervisor.Result;
                        if (!string.IsNullOrEmpty(supervisorData))
                        {
                            string managerUsername = NEDService.GetValueFromXml("//ns0:NIHSSO/ns0:SSOUsername", supervisorData);
                            if (!string.IsNullOrEmpty(managerUsername))
                            {
                                Console.WriteLine($"  found user principal name for supervisor ID = {supervisorId}: '{managerUsername}.'");
                                var managerDict = new Dictionary<string, object>();
                                managerDict["userPrincipalName"] = managerUsername;


                                string mCity = NEDService.GetValueFromXml("//ns0:Locality", userData);
                                AddOrUpdateDictionary(managerDict, "city", (!string.IsNullOrEmpty(mCity)) ? mCity : null);

                                string mFaxNumber = NEDService.GetValueFromXml("//ns0:PhoneNumber[@ns0:PhoneNumberType='Fax']", userData);
                                AddOrUpdateDictionary(managerDict, "faxNumber", (!string.IsNullOrEmpty(mFaxNumber)) ? mFaxNumber : null);

                                string mJobTitle = NEDService.GetValueFromXml("//ns0:Title", userData);
                                AddOrUpdateDictionary(managerDict, "jobTitle", (!string.IsNullOrEmpty(mJobTitle)) ? mJobTitle : null);
                                AddOrUpdateDictionary(managerDict, "jobTitle_keyword", (!string.IsNullOrEmpty(mJobTitle)) ? mJobTitle : null);

                                string mPostalCode = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:PostalCode", userData);
                                AddOrUpdateDictionary(managerDict, "postalCode", (!string.IsNullOrEmpty(mPostalCode)) ? mPostalCode : null);

                                string mStreetAddress = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Street", userData);
                                AddOrUpdateDictionary(managerDict, "streetAddress", (!string.IsNullOrEmpty(mStreetAddress)) ? mStreetAddress : null);

                                string mDepartment = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgPath", userData);
                                string mDepartmentConverted = mDepartment.Replace(" ", " / ");
                                AddOrUpdateDictionary(managerDict, "department", (!string.IsNullOrEmpty(mDepartmentConverted)) ? mDepartmentConverted : null);
                                AddOrUpdateDictionary(managerDict, "department_keyword", (!string.IsNullOrEmpty(mDepartmentConverted)) ? mDepartmentConverted : null);

                                string mDisplayName = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:FormattedName", userData);
                                AddOrUpdateDictionary(managerDict, "displayName", (!string.IsNullOrEmpty(mDisplayName)) ? mDisplayName : null);

                                string mGivenName = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@ns0:NameType='Legal']/ns0:GivenName", userData);
                                AddOrUpdateDictionary(managerDict, "givenName", (!string.IsNullOrEmpty(mGivenName)) ? mGivenName : null);

                                string mMail = NEDService.GetValueFromXml("//ns0:EmailAddresses/ns0:EmailAddress[@ns0:EmailAddressType='Preferred']", userData);
                                AddOrUpdateDictionary(managerDict, "mail", (!string.IsNullOrEmpty(mMail)) ? mMail : null);

                                string mOfficeLocation = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']", userData);
                                AddOrUpdateDictionary(managerDict, "officeLocation", (!string.IsNullOrEmpty(mOfficeLocation)) ? mOfficeLocation : null);

                                string mState = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:State", userData);
                                AddOrUpdateDictionary(managerDict, "state", (!string.IsNullOrEmpty(mState)) ? mState : null);

                                string mSurname = NEDService.GetValueFromXml("//ns0:Names/ns0:Name[@NameType='Legal']/ns0:Surname", userData);
                                AddOrUpdateDictionary(managerDict, "surname", (!string.IsNullOrEmpty(mSurname)) ? mSurname : null);

                                string mBusinessPhones = NEDService.GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", userData);
                                AddOrUpdateDictionary(managerDict, "businessPhones", (!string.IsNullOrEmpty(mBusinessPhones)) ? mBusinessPhones : null);

                                string mCountry = NEDService.GetValueFromXml("//ns0:Addresses/ns0:Address[@ns0:AddressType='Office']/ns0:Country", userData);
                                AddOrUpdateDictionary(managerDict, "country", (!string.IsNullOrEmpty(mCountry)) ? mCountry : null);

                                string mOtherMails = NEDService.GetValueFromXml("//ns0:EmailAddresses", userData);
                                AddOrUpdateDictionary(managerDict, "otherMails", (!string.IsNullOrEmpty(mOtherMails)) ? mOtherMails : null);

                                string mcustomfieldstring1 = NEDService.GetValueFromXml("//ns0:Uniqueidentifier", userData);
                                AddOrUpdateDictionary(managerDict, "customfieldstring1", (!string.IsNullOrEmpty(mcustomfieldstring1)) ? mcustomfieldstring1 : null);

                                string mcustomfieldstring2 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgPath", userData);
                                AddOrUpdateDictionary(managerDict, "customfieldstring2", (!string.IsNullOrEmpty(mcustomfieldstring2)) ? mcustomfieldstring2 : null);

                                string mcustomfieldstring3 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOrgName", userData);
                                AddOrUpdateDictionary(managerDict, "customfieldstring3", (!string.IsNullOrEmpty(mcustomfieldstring3)) ? mcustomfieldstring3 : null);

                                string mcustomfieldstring4 = NEDService.GetValueFromXml("//ns0:OrganizationInformation/ns0:NIHOUName", userData);
                                AddOrUpdateDictionary(managerDict, "customfieldstring4", (!string.IsNullOrEmpty(mcustomfieldstring4)) ? mcustomfieldstring4 : null);

                                string mTelephoneNumber = NEDService.GetValueFromXml("//ns0:PhoneNumbers/ns0:PhoneNumber[@ns0:PhoneNumberType='Office']", userData);
                                AddOrUpdateDictionary(managerDict, "customfieldstring5", (!string.IsNullOrEmpty(mTelephoneNumber)) ? mTelephoneNumber : null);

                                string memployeeType = NEDService.GetValueFromXml("//ns0:EmployeeType", userData);
                                string memployeeLetter = (string.IsNullOrEmpty(memployeeType) ? null : memployeeType.Substring(0, 1));
                                AddOrUpdateDictionary(managerDict, "customfieldstring6", (!string.IsNullOrEmpty(memployeeLetter)) ? memployeeLetter : null);

                                AddOrUpdateDictionary(user, "manager", JsonSerializer.Serialize(managerDict));
                            }
                        }
                        else
                        {
                            Console.WriteLine($"    Supervisor ID of {supervisorId} doesn't resolve to a valid NED user.");
                        }
                    }

                    if (importUserFlag)
                    {
                        WriteUserDictionaryToConsole(aadAccountName, user);
                        Console.WriteLine("  importUserFlag = TRUE. Importing user ...");
                    }
                    else
                    {
                        Console.WriteLine("  importUserFlag = FALSE. Skipping user.");
                        return null;
                    }
                }
                else
                {
                    Console.WriteLine($"  '{aadAccountName}' not found in NED. This user will not be synchronized.");
                    return null;
                }
                return user;
            }
            else
            {
                Console.WriteLine($"  User doesn’t exist in NED and will not be synchronized.");
                return null;
            }
        }


        public dynamic GroupFilter(dynamic item)
        {
            return item;
        }


        #endregion Implmentation: ICustomFilter


        #region Methods (Private)


        private void AddOrUpdateDictionary(Dictionary<string, object> user, string key, object value)
        {
            if (value != null) {user[key] = value;}
        }


        private void WriteUserDictionaryToConsole(string aadAccountName, Dictionary<string, object> userObject)
        {
            Console.WriteLine($"User object key/value pairs for '{aadAccountName}.'");
            foreach (var keyValuePair in userObject)
            {
                Console.WriteLine("  {0}: {1}", keyValuePair.Key, keyValuePair.Value.ToString());
            }
        }


        #endregion Methods (Private)


    }
}