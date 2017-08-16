
const adaptPropertiesToJSON = require('./adapters/adaptPropertiesToJSON');
const adaptProvidedProperties = require('./adapters/adaptProvidedProperties');
const compareValueObjects = require('./usecases/compareValueObjects');

class ValueObject {

  constructor(aMapOfProvidedProperties) {
    let listOfAdaptedProperties = adaptProvidedProperties(
      aMapOfProvidedProperties
    );

    addPropertiesToInstance(
      this,
      listOfAdaptedProperties
    );

    return makeValueImmutable(
      Object.assign(this, {

        serialize() {
          return adaptPropertiesToJSON(
            listOfAdaptedProperties
          );
        },

        equals(aValueObject) {
          return compareValueObjects(
            this,
            aValueObject
          );
        }
      })
    );
  }
}

function addPropertiesToInstance(
  aValueObject,
  aListOfPropertiesDescriptors
) {

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
