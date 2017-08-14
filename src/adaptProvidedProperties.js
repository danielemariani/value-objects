
function adaptProvidedProperties(providedProperties) {
  return Object
    .entries(providedProperties)
    .map(processProperty);
}

function processProperty(aPropertyEntry) {
  let propertyName = aPropertyEntry[0];
  let propertyValue = aPropertyEntry[1];

  let propertyDescriptor = adaptPropertyToDescriptorObject(
    propertyName,
    propertyValue
  );

  return propertyDescriptor;
}

function adaptPropertyToDescriptorObject(
  aPropertyName,
  aPropertyDescriptor
) {

  return {
    name: aPropertyName,
    value: extractPropertyValueFromDescriptor(
      aPropertyName,
      aPropertyDescriptor
    ),
    validator: extractPropertyValidatorFromDescriptor(
      aPropertyDescriptor
    )
  };
}

function extractPropertyValueFromDescriptor(
  aPropertyName,
  aProvidedProperty
) {

  if (isPropertyASimpleValue(aProvidedProperty)) {
    return aProvidedProperty;
  }

  if (isPropertyADescriptorObject(aProvidedProperty)) {
    return aProvidedProperty.value;
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

function extractPropertyValidatorFromDescriptor(aPropertyDescriptor) {
  let defaultValidator = function emptyValidator() {
    return true;
  };

  if (isAFunction(aPropertyDescriptor.validator)) {
    return aPropertyDescriptor.validator;
  }

  if (isNotDefined(aPropertyDescriptor.validator)) {
    return defaultValidator;
  }

  throw new TypeError(`ValueObject was provided a invalid validator for property "${aPropertyDescriptor.name}"`);
}

function isAFunction(aMaybeFunction) {
  return typeof aMaybeFunction === 'function';
}

function isNotDefined(aValue) {
  return typeof aValue === 'undefined';
}

module.exports = adaptProvidedProperties;
