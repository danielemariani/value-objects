
// From: https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i);
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
