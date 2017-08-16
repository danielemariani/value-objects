
function adaptPropertiesToPlainObject(aListOfProperties) {
  let propertiesMap = {};

  aListOfProperties.forEach(aProperty => {
    propertiesMap[aProperty.name] = aProperty.value;
  });

  return propertiesMap;
}

module.exports = adaptPropertiesToPlainObject;
