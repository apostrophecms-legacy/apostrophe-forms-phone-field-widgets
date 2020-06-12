const {
  parsePhoneNumber,
  ParseError,
  getCountries,
  getCountryCallingCode
} = require('libphonenumber-js/max');

const isoCountries = require("i18n-iso-countries");

module.exports = {
  extend: 'apostrophe-forms-base-field-widgets',
  label: 'Phone Number Input',
  construct: function (self, options) {

    self.sanitizeFormField = function (req, form, widget, input, output) {
      const value = self.apos.launder.string(input[widget.fieldName]);
      if (value.length) {
        try {
          const phoneNumber = parsePhoneNumber(value);
          // Full validation is separate from parsing
          if (!phoneNumber.isValid()) {
            throw {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                errorMessage: 'That is not a valid phone number.'
              }
            };
          }
          output[widget.fieldName] = phoneNumber.formatInternational();
        } catch (error) {
          const messages = {
            INVALID_COUNTRY: 'You must include a country code. If you aren\'t sure, use the country selector.',
            TOO_SHORT: 'Please enter the complete phone number.',
            TOO_LONG: 'That number is too long to be valid.',
            NOT_A_NUMBER: 'That is not a phone number.'
          };
          if (error instanceof ParseError) {
            // Not a phone number, non-existent country, etc.
            throw {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                errorMessage: messages[error.message]
              }
            };
          } else {
            self.apos.utils.error(error);
            throw {
              fieldError: {
                field: widget.fieldName,
                error: 'invalid',
                errorMessage: 'That is not a valid phone number.'
              }
            };
          }
        }
      }
    };

    self.apiRoute('get', 'countries', function(req, res, next) {
      const callingCodesByCountry = {};
      for (const country of getCountries()) {
        callingCodesByCountry[country] = getCountryCallingCode(country);
      }
      let locale = req.locale.replace(/-draft/, '');
      let countries = isoCountries.getNames(locale);
      const workflow = self.apos.modules['apostrophe-workflow'];
      if (!Object.keys(countries).length) {
        if (workflow) {
          locale = workflow.defaultLocale;
          countries = isoCountries.getNames(locale);
        }
      }
      if (!Object.keys(countries).length) {
        countries = isoCountries.getNames('en');
      }
      return next(null, {
        callingCodesByCountry,
        countries
      });
    });
  
  }
};
