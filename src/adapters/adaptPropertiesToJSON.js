
function adaptPropertiesToJSON(aListOfProperties) {
  let propertiesMap = {};

  aListOfProperties.forEach(aProperty => {
    propertiesMap[aProperty.name] = aProperty.value;
  });

  return JSON.stringify(propertiesMap);
}

module.exports = adaptPropertiesToJSON;
