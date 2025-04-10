export function employeeDetailWidget_handlebars() {
  // Adds spaces around forward slashes
  Handlebars.registerHelper('OrganizationSpaces', function (organization) {
    if (typeof organization == 'string') {
      var spacedOrg = organization.replaceAll('/', ' / ');
      return spacedOrg;
    } else {
      return organization;
    }
  });

  Handlebars.registerHelper('formatAddress', function (text) {
    // Replace all occurrences of $ with a line break
    return new Handlebars.SafeString(text.replace(/\$/g, '<br>'));
  });

  // Hides +1 in phone number
  Handlebars.registerHelper('formatPhone', function (phone) {
    return phone.replace('+1 ', '');
  });
  
}
