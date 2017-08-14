
class ValueObject {

  constructor(aMapOfProperties) {
    let providedProperties = processProvidedProperties(
      aMapOfProperties
    );

    addPropertiesToValueObjectInstance(
      this,
      providedProperties
    );

    function serialize() {
      let propertiesMap = {};

      providedProperties.forEach(aProvidedProperty => {
        propertiesMap[aProvidedProperty.name] = aProvidedProperty.value;
      });

      return JSON.stringify(propertiesMap);
    }

    return makeValueImmutable(
      Object.assign(this, { serialize })
    );
  }
}

function processProvidedProperties(
  aMapOfProperties
) {

  return Object
    .entries(aMapOfProperties)
    .map(processProvidedProperty);

  function processProvidedProperty(aPropertyEntry) {
    let propertyName = aPropertyEntry[0];
    let propertyValue = aPropertyEntry[1];

    let propertyDescriptor = adaptProvidedPropertyToDescriptorObject(
      propertyName,
      propertyValue
    );

    return propertyDescriptor;
  }
}

function addPropertiesToValueObjectInstance(aValueObject, aListOfPropertiesDescriptors) {
  aListOfPropertiesDescriptors
    .forEach(aPropertyDescriptor => {
      addPropertyToValueObjectInstance(
        aValueObject,
        aPropertyDescriptor
      );
    });
}

function adaptProvidedPropertyToDescriptorObject(
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

function addPropertyToValueObjectInstance(
  aValueObject,
  aPropertyDescriptor
) {

  validateProperty(
    aPropertyDescriptor
  );

  addPropertyGetterToObject(
    aValueObject,
    aPropertyDescriptor
  );
}

function validateProperty(aPropertyDescriptor) {
  let propertyName = aPropertyDescriptor.name;
  let propertyValue = aPropertyDescriptor.value;
  let propertyValidator = aPropertyDescriptor.validator;

  if (propertyValidator(propertyValue) !== true) {
    throw new TypeError(`ValueObject was provided an invalid value for property "${propertyName}", value: "${propertyValue}"`);
  }
}

function addPropertyGetterToObject(
  aObject,
  aPropertyDescriptor
) {

  let propertyName = aPropertyDescriptor.name;
  let propertyValue = makeValueImmutable(aPropertyDescriptor.value);

  Object.defineProperty(aObject, propertyName, {
    value: () => { return propertyValue; }
  });
}

function makeValueImmutable(aValue) {
  return Object.freeze(aValue);
}

module.exports = ValueObject;
