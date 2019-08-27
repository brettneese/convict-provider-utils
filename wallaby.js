// Wallaby is an alternative test runner.

// FakeAuth for AWS, if using LocalStack

// process.env.AWS_ENDPOINT_EC2 = "http://localhost:4597"; // etc

module.exports = function() {
    return {
      setup: function(wallaby) {
        var mocha = wallaby.testFramework;
        mocha.timeout(5000);
      },
      files: [
        { pattern: "lib/index.js", load: true },
        { pattern: "node_modules/**", ignore: true },
      ],
  
      tests: [
        { pattern: "lib/index.spec.js", load: true },
        { pattern: "node_modules/**", ignore: true }
      ],
      env: {
        type: "node",
        runner: "node"
      },
      setup: function(wallaby) {},
  
      teardown: function(wallaby) {}
    };
  };
  