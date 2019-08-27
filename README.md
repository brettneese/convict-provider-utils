# convict-provider-utils
A helper library to facilitate building providers for the `node-convict` configuration library. 

## Rationale 

The `node-convict` library is fantastic, and it includes a built-in feature that allows developers to connect `node-convict` to their own secrets/config provider, such as Kubernetes secrets or AWS SSM. But it's a bit tricky to parse a Convict's nested schema in order to build a provider 

This little package makes it super easy to develop a custom provider for `node-convict` by exposing a `getValues()` function. 

This function accepts a plain-object `convict` schema object, a property on the `convict` object itself (for instance, "file," "SSM," etc), and a getter function to apply to the properties of the `convict` schema, fetching the appropriate values from remote source. 

For instance, in pseudocode, I might do something like

```javascript
const utils = require("./convictUtils");

let schema = {
  foo: {
    bar: {
      baz: {
        default: "fred",
        format: "String",
        file: "/foo/bar/baz"
      }
    },
    baz: {
      default: "fred",
      format: "String",
      file: "/foo/baz"
    }
  }
};

let getValue = function(file) {
    console.log(file) // /foo/bar, /foo/bar/baz
    return readFile(file); // xyzz
};

let config = utils.getValues(schema, "file", getValue);

return convict(schema).load(remoteConfig);
```

This _should_ also allow providers/getters written to be compatible with Convict's future support for custom getters, allowing a value to be fetched either as part of an entire `load()` at load-time or individually via the same custom getter at runtime. 