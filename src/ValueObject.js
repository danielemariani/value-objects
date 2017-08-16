
require('./polyfills/objectEntriesPolyfill');

const compareValueObjects = require('./usecases/compareValueObjects');
const adaptProvidedProperties = require('./adapters/adaptProvidedProperties');
const adaptPropertiesToPlainObject = require('./adapters/adaptPropertiesToPlainObject');

class ValueObject {

  constructor(aMapOfProvidedProperties) {
    let listOfAdaptedProperties = adaptProvidedProperties(
      aMapOfProvidedProperties
    );

    addPropertiesToInstance
      .call(this, listOfAdaptedProperties);

    return makeValueImmutable(
      Object.assign(this, {

        serialize() {
          return JSON.stringify(
            adaptPropertiesToPlainObject(
              listOfAdaptedProperties
            )
          );
        },

        equals(aValueObject) {
          return compareValueObjects(
            this,
            aValueObject
          );
        },

        // @override
        toJSON() {
          return JSON.parse(this.serialize());
        },

        // @override
        valueOf() {
          return adaptPropertiesToPlainObject(
            listOfAdaptedProperties
          );
        }
      })
    );
  }
}

function addPropertiesToInstance(aListOfPropertiesDescriptors) {
  aListOfPropertiesDescriptors
    .forEach(addPropertyToInstance.bind(this));
}

function addPropertyToInstance(aPropertyDescriptor) {
  validateProperty(aPropertyDescriptor);

  addPropertyGetterToInstance
    .call(this, aPropertyDescriptor);
}

function validateProperty(aPropertyDescriptor) {
  let propertyName = aPropertyDescriptor.name;
  let propertyValue = aPropertyDescriptor.value;
  let propertyValidator = aPropertyDescriptor.validator;

  if (propertyValidator(propertyValue) !== true) {
    throw new TypeError(`ValueObject was provided an invalid value for property "${propertyName}",\
      value: "${propertyValue}" did not pass the property validation`);
  }
}

function addPropertyGetterToInstance(aPropertyDescriptor) {
  let propertyName = aPropertyDescriptor.name;
  let propertyValue = makeValueImmutable(aPropertyDescriptor.value);

  Object.defineProperty(this, propertyName, {
    value: () => { return propertyValue; }
  });
}

function makeValueImmutable(aValue) {
  return Object.freeze(aValue);
}

module.exports = ValueObject;

