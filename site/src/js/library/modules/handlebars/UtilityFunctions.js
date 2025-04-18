export function utilityFunctions_handlebars() {
  Handlebars.registerHelper('formatPhone', function (phones) {
    console.log("xxxxxxxxxxxxxxx");
    console.log(typeof(phones));
    console.log(phones);
    const wasArray = Array.isArray(phones);
    const input = wasArray ? phones : [phones];

    const output = input.map((phone) => {
      phone = String(phone || '');
      return phone.replace('+1 ', '').replaceAll(' ', '-');
    });

    return wasArray ? output : output[0];
  });
}
