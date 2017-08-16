
const matchers = require('../helpers/matchers');

const DEFAULT_VALIDATOR = function defaultValidator() {
  return true;
};

function validateProperty(
  aValueObjectInstance,
  aPropertyDescriptor
) {

  let propertyName = aPropertyDescriptor.name;
  let propertyValue = aPropertyDescriptor.value;

  let propertyValidator = getValidatorForProperty(
    aValueObjectInstance,
    propertyName
  );

  if (propertyValidator(propertyValue) !== true) {
    throw new TypeError(`ValueObject was provided an invalid value for property "${propertyName}",\
      value: "${propertyValue}" did not pass the property validation`);
  }
}

function getValidatorForProperty(
  aValueObjectInstance,
  aPropertyName
) {

  let validators = getValidatorsMapForInstance(aValueObjectInstance);
  let validator = validators[aPropertyName];

  if (matchers.isFunction(validator)) {
    return validator;
  }

  return DEFAULT_VALIDATOR;
}

function getValidatorsMapForInstance(aValueObjectInstance) {
  return aValueObjectInstance
    .constructor.validators();
}

module.exports = validateProperty;

