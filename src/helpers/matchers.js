
function isFunction(aValue) {
  return typeof aValue === 'function';
}

function isObject(aValue) {
  return (
    typeof aValue === 'object' &&
    !isArray(aValue) &&
    !isNull(aValue)
  );
}

function isArray(aValue) {
  return Object.prototype.toString.call(aValue) === '[object Array]';
}

function isNull(aValue) {
  return aValue === null;
}

function isDefined(aValue) {
  return typeof aValue !== 'undefined';
}

function isNotDefined(aValue) {
  return !isDefined(aValue);
}

function isSimpleValue(aValue) {
  return (
    !isObject(aValue) &&
    !isFunction(aValue)
  );
}

module.exports = {
  isFunction,
  isObject,
  isArray,
  isNull,
  isDefined,
  isNotDefined,
  isSimpleValue
};
