
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
    let properties = cloneValue(
      this[PRIVATES].mapOfProvidedProperties
    );

    adaptProvidedProperties(aMapOfProvidedProperties)
      .forEach(aProperty => {
        let propertyName = aProperty.name;
        let newPropertyValue = aProperty.value;
        let originalProperty = properties[propertyName];

        properties[propertyName] = newPropertyValue;
      });

    return new this.constructor(properties);
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
  validateProperty(this, aPropertyDescriptor);

  addPropertyGetterToInstance
    .call(this, aPropertyDescriptor);
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

function cloneValue(aValue) {
  return Object.assign({}, aValue);
}

module.exports = ValueObject;

