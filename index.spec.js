const chai = require("chai");
const expect = chai.expect;
const lib = require("./lib");

describe("objectify()", async function () {
    it("constructs a javascript object from an array", async function () {

        let value = "value"
        let keyPath = "foo.bar.baz.PROPERTY"
        keyPath = keyPath.split(".");

        let r = lib._objectify(keyPath, value)

        let expectedResponse = {
            foo: {
                bar: {
                    baz: {
                        PROPERTY: "value"
                    }
                }
            }
        }

        expect(r.foo.bar.baz.PROPERTY).to.equal("value");
        expect(r).to.deep.equal(expectedResponse);
    });

    it("constructs a javascript object from a string", async function () {

        let value = "value"
        let keyPath = "foo.bar.baz.PROPERTY"

        let r = lib._objectify(keyPath, value)

        let expectedResponse = {
            foo: {
                bar: {
                    baz: {
                        PROPERTY: "value"
                    }
                }
            }
        }

        expect(r.foo.bar.baz.PROPERTY).to.equal("value");
        expect(r).to.deep.equal(expectedResponse);
    });
});
