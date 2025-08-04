# ⛔️ **DEPRECATED** — do not use for new projects

See [our current docs](https://docs.apostrophecms.org/)

This module adds a phone number field supporting full validation of international phone number formats. It is meant for use alongside the `apostrophe-forms` module.

When using it, you must configure the `formWidgets` option to `apostrophe-forms` to include it, as well as all other form widgets you wish to use. See the `apostrophe-forms` documentation.

## Configuration

```javascript
// in app.js
modules: {
  'apostrophe-forms': {
    formWidgets: {
      // other fields go here
      'apostrophe-forms-phone-field': {}
    }
  },
  'apostrophe-forms-phone-field-widgets'
}
```

The user will be prompted to select a country and the country code will be automatically supplied when they do. The user may also skip that step and enter their own country code. If the phone number is supplied without a country code the user is required to provide it.
