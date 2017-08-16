
function isFunction(aMaybeFunction) {
  return typeof aMaybeFunction === 'function';
}

function isArray(aMaybeArray) {
  return Object.prototype.toString.call(aMaybeArray) === '[object Array]';
}

function isObject(aValue) {
  return typeof aValue === 'object';
}

function isDefined(aValue) {
  return typeof aValue !== 'undefined';
}

function isNotDefined(aValue) {
  return !isDefined(aValue);
}

function isSimpleValue(aValue) {
  return (
    typeof aValue !== 'object' ||
    isArray(aValue)
  );
}

module.exports = {
  isFunction,
  isObject,
  isArray,
  isDefined,
  isNotDefined,
  isSimpleValue
};
