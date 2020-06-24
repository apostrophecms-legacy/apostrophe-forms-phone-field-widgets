apos.utils.widgetPlayers['apostrophe-forms-phone-field'] = function(el, widget, options) {
  var formsWidget = apos.utils.closest(el, '[data-apos-widget="apostrophe-forms"]');
  if (!formsWidget) {
    // Editing the form in the piece modal, it is not active for submissions
    return;
  }
  formsWidget.addEventListener('apos-forms-validate', function(event) {
    var input = el.querySelector('input');
    // Full phone number validation occurs on the server side due to the weight of the library
    event.input[input.getAttribute('name')] = input.value;
  });
  apos.utils.get('/modules/apostrophe-forms-phone-field-widgets/countries', {}, function(err, data) {
    if (err || (data.status !== 'ok')) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    var i;
    var iso = Object.keys(data.countries);
    var country = el.querySelector('[name="' + widget.fieldName + '-country"]');
    var field = el.querySelector('[name="' + widget.fieldName + '"]');
    for (i = 0; (i < iso.length); i++) {
      var option = document.createElement('option');
      option.setAttribute('value', iso[i]);
      option.innerText = data.countries[iso[i]];
      country.appendChild(option);
    }
    country.onchange = function(e) {
      field.value = '+' + data.callingCodesByCountry[country.value] + ' ';
      field.focus();
      field.value.selectionStart = field.value.selectionEnd = field.value.length;
    };
  });
};
