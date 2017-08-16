
const compareValueObjects = require('./usecases/compareValueObjects');
const adaptProvidedProperties = require('./adapters/adaptProvidedProperties');
const adaptPropertiesToPlainObject = require('./adapters/adaptPropertiesToPlainObject');

const PRIVATES = Symbol('__privates__');

class ValueObject {

  constructor(aMapOfProvidedProperties = {}) {
    let mapOfProvidedProperties = aMapOfProvidedProperties;

    let listOfAdaptedProperties = adaptProvidedProperties(
      aMapOfProvidedProperties
    );

    let mapOfAdaptedProperties = makeValueImmutable(
      adaptPropertiesToPlainObject(listOfAdaptedProperties)
    );

    this[PRIVATES] = {
      mapOfProvidedProperties,
      listOfAdaptedProperties,
      mapOfAdaptedProperties
    };

    addPropertiesToInstance
      .call(this, listOfAdaptedProperties);
  }

  serialize() {
    return JSON.stringify(
      this[PRIVATES].mapOfAdaptedProperties
    );
  }

  equals(aValueObject) {
    return compareValueObjects(
      this,
      aValueObject
    );
  }

  withValues(aMapOfProvidedProperties) {
    let mergedProperties = mergeObjects(
      this[PRIVATES].mapOfProvidedProperties,
      aMapOfProvidedProperties
    );

    return new this
      .constructor(mergedProperties);
  }

  // @override
  toJSON() {
    return this[PRIVATES]
      .mapOfAdaptedProperties;
  }

  // @override
  valueOf() {
    return this[PRIVATES]
      .mapOfAdaptedProperties;
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

function mergeObjects(aObject, anotherObject) {
  return Object.assign({}, aObject, anotherObject);
}

module.exports = ValueObject;

