
const adaptProvidedProperties = require('./adaptProvidedProperties');

class ValueObject {

  constructor(aMapOfProvidedProperties) {
    let instance = this;

    let adaptedProperties = adaptProvidedProperties(
      aMapOfProvidedProperties
    );

    addPropertiesToInstance(
      instance,
      adaptedProperties
    );

    function serialize() {
      let propertiesMap = {};

      adaptedProperties.forEach(aProperty => {
        propertiesMap[aProperty.name] = aProperty.value;
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

  addPropertyGetterToInstance(
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

function addPropertyGetterToInstance(
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
