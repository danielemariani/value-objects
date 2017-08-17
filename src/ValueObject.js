
const validateProperty = require('./usecases/validateProperty');
const compareValueObjects = require('./usecases/compareValueObjects');

const adaptProvidedProperties = require('./adapters/adaptProvidedProperties');
const adaptPropertiesToPlainObject = require('./adapters/adaptPropertiesToPlainObject');

const PRIVATES = Symbol('__privates__');

class ValueObject {

  static validators() {
    return {};
  }

  constructor(aMapOfProvidedProperties = {}) {
    let mapOfProvidedProperties = aMapOfProvidedProperties;

    let listOfProperties = adaptProvidedProperties(
      aMapOfProvidedProperties
    );

    let mapOfProperties = makeValueImmutable(
      adaptPropertiesToPlainObject(listOfProperties)
    );

    this[PRIVATES] = {
      mapOfProvidedProperties,
      listOfProperties,
      mapOfProperties
    };

    addPropertiesToInstance
      .call(this, listOfProperties);
  }

  serialize() {
    return JSON.stringify(this);
  }

  equals(aValueObject) {
    return compareValueObjects(
      this,
      aValueObject
    );
  }

  withValues(aMapOfProvidedProperties) {
    let currentProperties = cloneValue(
      this[PRIVATES].mapOfProvidedProperties
    );

    return new this.constructor(
      Object.assign(
        this[PRIVATES].mapOfProvidedProperties,
        aMapOfProvidedProperties
      )
    );
  }

  // @override
  toJSON() {
    return this.valueOf();
  }

  // @override
  valueOf() {
    return this[PRIVATES]
      .mapOfProperties;
  }
}

function addPropertiesToInstance(aListOfPropertiesDescriptors) {
  aListOfPropertiesDescriptors
    .forEach(addPropertyToInstance.bind(this));
}

function addPropertyToInstance(aPropertyDescriptor) {
  validateProperty(this, aPropertyDescriptor);

  addPropertyGetterToInstance
    .call(this, aPropertyDescriptor);
}

function addPropertyGetterToInstance(aPropertyDescriptor) {
  let propertyName = aPropertyDescriptor.name;

  let propertyValue = makeValueImmutable(
    aPropertyDescriptor.value
  );

  Object.defineProperty(this, propertyName, {
    value: () => { return propertyValue; }
  });
}

function makeValueImmutable(aValue) {
  return Object.freeze(aValue);
}

function cloneValue(aValue) {
  return Object.assign({}, aValue);
}

module.exports = ValueObject;

