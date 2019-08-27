const merge = require("lodash.merge");

// https://github.com/mozilla/node-convict/blob/61e8b9b5b6c89ea905fe8cd962492342ea2b1100/lib/convict.js#L457
function walk(obj, path, initializeMissing) {
  if (path) {
    let ar = path.split(".");
    while (ar.length) {
      let k = ar.shift();
      if (initializeMissing && obj[k] == null) {
        obj[k] = {};
        obj = obj[k];
      } else if (k in obj) {
        obj = obj[k];
      } else {
        throw new Error("cannot find configuration param '" + path + "'");
      }
    }
  }

  return obj;
}

// https://github.com/mozilla/node-convict/blob/61e8b9b5b6c89ea905fe8cd962492342ea2b1100/lib/convict.js#L101
function flatten(obj) {
  let stack = Object.keys(obj);
  let key;

  let entries = [];

  while (stack.length) {
    key = stack.shift();
    let val = walk(obj, key);
    if (typeof val === "object" && !Array.isArray(val) && val != null) {
      let subkeys = Object.keys(val);

      // Don't filter out empty objects
      if (subkeys.length > 0) {
        subkeys.forEach(function(subkey) {
          stack.push(key + "." + subkey);
        });
        continue;
      }
    }
    entries.push([key, val]);
  }

  let flattened = {};
  entries.forEach(function(entry) {
    let key = entry[0];

    const val = entry[1];
    flattened[key] = val;
  });

  return flattened;
}

// @todo write tests
// @todo write docs
function objectify(path, value, returnObj = {}) {
  if (typeof path == "string") {
    path = path.split(".");
  }

  let firstPath = path[0];
  returnObj[firstPath] = {};
  path.shift();

  if (path.length > 0) {
    objectify(path, value, returnObj[firstPath]);
  } else {
    returnObj[firstPath] = value;
  }

  return returnObj;
};

// @todo write docs
// @todo write tests
function getValues(schema, property, getter, options = {}) {
  let merged = {};
  let flattenedSchema = this.flatten(schema);

  Object.keys(flattenedSchema).forEach(function(key) {
    let k = key.split(".");

    if (k.pop() == property) {
      let value = getter(flattenedSchema[key], options);
      let o = objectify(k, value);

      merge(merged, o);
    }
  });

  return merged;
}

module.exports = {
  _flatten: flatten,
  _objectify: objectify,
  _walk: walk,
  getValues: getValues
}