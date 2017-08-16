
const matchers = require('../helpers/matchers');

function compareValueObjects(aValue, anotherValue) {
  if (
    !matchers.isFunction(aValue.serialize) ||
    !matchers.isFunction(anotherValue.serialize)
  ) {
    return false;
  }

  return aValue.serialize() === anotherValue.serialize();
}


module.exports = compareValueObjects;
