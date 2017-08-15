
const DEFAULT_VALIDATOR = function defaultValidator() {
  return true;
};

function adaptProvidedProperties(providedProperties) {
  return Object
    .entries(providedProperties)
    .map(processProperty);
}

function processProperty(aPropertyEntry) {
  let propertyName = aPropertyEntry[0];
  let providedPropertyValue = aPropertyEntry[1];

  return adaptPropertyToDescriptor(
    propertyName,
    providedPropertyValue
  );
}

function adaptPropertyToDescriptor(
  aPropertyName,
  aProvidedPropertyValue
) {

  return {
    name: aPropertyName,
    value: extractPropertyValue(
      aPropertyName,
      aProvidedPropertyValue
    ),
    validator: extractPropertyValidator(
      aPropertyName,
      aProvidedPropertyValue
    )
  };
}

function extractPropertyValue(
  aPropertyName,
  aProvidedPropertyValue
) {

  if (isPropertyASimpleValue(aProvidedPropertyValue)) {
    return aProvidedPropertyValue;
  }

  if (isPropertyADescriptorObject(aProvidedPropertyValue)) {
    return aProvidedPropertyValue.value;
  }

  throw new TypeError(`ValueObject was provided a invalid property "${aPropertyName}"`);
}

function isPropertyASimpleValue(aProvidedProperty) {
  return typeof aProvidedProperty !== 'object';
}

function isPropertyADescriptorObject(aProvidedProperty) {
  return (
    typeof aProvidedProperty === 'object' &&
    typeof aProvidedProperty.value !== 'undefined'
  );
}

function extractPropertyValidator(
  aPropertyName,
  aProvidedPropertyValue
) {

  if (isAFunction(aProvidedPropertyValue.validator)) {
    return aProvidedPropertyValue.validator;
  }

  if (isNotDefined(aProvidedPropertyValue.validator)) {
    return DEFAULT_VALIDATOR;
  }

  throw new TypeError(`ValueObject was provided a invalid validator for property "${aPropertyName}"`);
}

function isAFunction(aMaybeFunction) {
  return typeof aMaybeFunction === 'function';
}

function isNotDefined(aValue) {
  return typeof aValue === 'undefined';
}

module.exports = adaptProvidedProperties;
