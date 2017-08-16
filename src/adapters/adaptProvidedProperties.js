
const matchers = require('../helpers/matchers');

function adaptProvidedProperties(providedProperties) {
  return Object
    .entries(providedProperties)
    .map(adaptPropertyEntryToDescriptor);
}

function adaptPropertyEntryToDescriptor(aPropertyEntry) {
  let propertyName = aPropertyEntry[0];
  let propertyValue = aPropertyEntry[1];

  return {
    name: propertyName,
    value: propertyValue
  };
}

module.exports = adaptProvidedProperties;

