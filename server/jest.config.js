module.exports = {
  // A set of global variables that should be available to all tests
  globals: {
    // Increase test timeout globally
    jasmine: {
      DEFAULT_TIMEOUT_INTERVAL: 30000,
    },
  },

  // The maximum amount of workers used to run your tests
  // Set to 1 to prevent race conditions between tests
  maxWorkers: 1,

  // Indicates whether the coverage information should be collected
  collectCoverage: false,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // A list of paths to modules that run some code to configure the testing framework
  // before each test file in the suite is executed
  setupFilesAfterEnv: ["<rootDir>/__test__/setup.js"],

  // Retry failed tests to handle flaky tests
  retry: 2,
};
