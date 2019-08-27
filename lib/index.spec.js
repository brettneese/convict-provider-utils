const chai = require("chai");
const expect = chai.expect;
const lib = require(".");

describe("objectify()", async function() {
  it("parses a simple config", async function() {
    schema = {
      baz: {
        default: "fred",
        format: "String",
        SSM: "/foo/bar/baz" // can use multiple basePaths, and we'll only need to contact AWS once per path
      },
      qux: {
        default: 0,
        format: "String",
        SSM: "/foo/bar/baz/qux"
      }
    };

    
    let r = provider(schema);

    expect(r).to.deep.equal(expectedResponse);
  });

  it("parses a deeply nested config", async function() {
    schema = {
      foo: {
        bar: {
          baz: {
            default: "fred",
            format: "String",
            SSM: "/foo/baz"
          }
        },
        baz: {
          default: "fred",
          format: "String",
          SSM: "/foo/baz"
        }
      }
    };

    let r = lib.parseConvictConfig(schema);

    let expectedResponse = {
      foo: {
        bar: {
          baz: "xyzzy"
        },
        baz: "xyzzy"
      }
    };

    r = lib.parseConvictConfig(schema);

    expect(r).to.deep.equal(expectedResponse);
  });

  after(async function() {
    await hooks.removeSsmParams();
  });
});
