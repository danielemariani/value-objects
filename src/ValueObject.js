
const adaptProvidedProperties = require('./adaptProvidedProperties');

class ValueObject {

  constructor(aMapOfProperties) {
    let instance = this;

    let providedProperties = adaptProvidedProperties(
      aMapOfProperties
    );

    addPropertiesToInstance(
      instance,
      providedProperties
    );

    function serialize() {
      let propertiesMap = {};

      providedProperties.forEach(aProvidedProperty => {
        propertiesMap[aProvidedProperty.name] = aProvidedProperty.value;
      });

      return JSON.stringify(propertiesMap);
    }

    function equals(aValueObject) {
      if (!isValueObject(aValueObject)) {
        return false;
      }

      return instance.serialize() === aValueObject.serialize();
    }

    return makeValueImmutable(
      Object.assign(instance, { serialize, equals })
    );
  }
}

function isValueObject(aMaybeValueObject) {
  return aMaybeValueObject instanceof ValueObject;
}

function addPropertiesToInstance(aValueObject, aListOfPropertiesDescriptors) {
  aListOfPropertiesDescriptors
    .forEach(aPropertyDescriptor => {
      addPropertyToInstance(
        aValueObject,
        aPropertyDescriptor
      );
    });
}

function addPropertyToInstance(
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
    throw new TypeError(`ValueObject was provided an invalid value for property "${propertyName}", value: "${propertyValue}" did not pass the property validation`);
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
