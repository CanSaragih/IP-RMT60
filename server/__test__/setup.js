// Advanced test environment setup
const helpers = require("./test-helpers");

// Increase timeout for all tests
jest.setTimeout(30000);

// Create a global test state object to track test metrics
global.__TEST_METRICS__ = {
  startTime: Date.now(),
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  totalDuration: 0,

  // Record test result
  recordTest(result, duration) {
    if (result === "passed") this.passedTests++;
    else if (result === "failed") this.failedTests++;
    else if (result === "skipped") this.skippedTests++;

    this.totalDuration += duration;
  },

  // Get summary
  getSummary() {
    return {
      totalTests: this.passedTests + this.failedTests + this.skippedTests,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      skippedTests: this.skippedTests,
      successRate: `${Math.round(
        (this.passedTests / (this.passedTests + this.failedTests)) * 100
      )}%`,
      totalDuration: `${Math.round(this.totalDuration / 1000)}s`,
      totalTime: `${Math.round((Date.now() - this.startTime) / 1000)}s`,
    };
  },
};

// Add global helpers for use in tests
global.delay = helpers.delay;
global.generateTestData = helpers.generateTestData;

// Add custom matcher for REST API responses
expect.extend({
  toBeSuccessfulResponse(received) {
    const pass = received.statusCode >= 200 && received.statusCode < 300;
    return {
      pass,
      message: () =>
        `expected status code ${received.statusCode} to ${
          pass ? "not " : ""
        }be successful (2xx)`,
    };
  },

  toBeErrorResponse(received) {
    const pass = received.statusCode >= 400;
    return {
      pass,
      message: () =>
        `expected status code ${received.statusCode} to ${
          pass ? "not " : ""
        }be an error (4xx/5xx)`,
    };
  },

  toHaveProperty(received, property) {
    // Deep property check
    const hasProperty = helpers.hasProperty(received, property);
    return {
      pass: hasProperty,
      message: () =>
        `expected object to ${
          hasProperty ? "not " : ""
        }have property '${property}'`,
    };
  },
});

// Track individual test execution
const originalIt = global.it;
global.it = (name, fn, timeout) => {
  if (!fn) return originalIt(name, fn, timeout);

  return originalIt(
    name,
    async (...args) => {
      const startTime = Date.now();
      let result = "passed";

      try {
        await fn(...args);
      } catch (error) {
        result = "failed";
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        global.__TEST_METRICS__.recordTest(result, duration);
      }
    },
    timeout
  );
};

// Also track test.skip and test.only
global.it.skip = (name, fn, timeout) => {
  global.__TEST_METRICS__.recordTest("skipped", 0);
  return originalIt.skip(name, fn, timeout);
};

global.it.only = (name, fn, timeout) => {
  if (!fn) return originalIt.only(name, fn, timeout);

  return originalIt.only(
    name,
    async (...args) => {
      const startTime = Date.now();
      let result = "passed";

      try {
        await fn(...args);
      } catch (error) {
        result = "failed";
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        global.__TEST_METRICS__.recordTest(result, duration);
      }
    },
    timeout
  );
};

// Alias test to it
global.test = global.it;
global.test.skip = global.it.skip;
global.test.only = global.it.only;

// Enhanced console logging for better test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Add timestamp to logs
  originalConsoleLog(`[${new Date().toISOString()}]`, ...args);
};

// Suppress some noisy console output during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out common noise
  const message = args.join(" ");
  if (
    message.includes("ECONNREFUSED") ||
    message.includes("Connection error") ||
    message.includes("timeout")
  ) {
    // Suppress these
    return;
  }
  originalConsoleError(`[ERROR ${new Date().toISOString()}]`, ...args);
};

// Also make console.warn less noisy
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Only show important warnings
  const message = args.join(" ");
  if (message.startsWith("Skipping test")) {
    // Suppress test skip messages
    return;
  }
  originalConsoleWarn(`[WARN ${new Date().toISOString()}]`, ...args);
};

// Add a global beforeAll to give extra time between test suites
beforeAll(async () => {
  // Wait a moment before starting tests
  await helpers.delay(1000);
  console.log("Starting test suite execution");
});

// Add afterAll to print test metrics
afterAll(async () => {
  const summary = global.__TEST_METRICS__.getSummary();
  console.log("");
  console.log("------------------------------------");
  console.log("TEST EXECUTION SUMMARY:");
  console.log(`Total tests: ${summary.totalTests}`);
  console.log(`  ✓ Passed: ${summary.passedTests}`);
  console.log(`  ✗ Failed: ${summary.failedTests}`);
  console.log(`  ○ Skipped: ${summary.skippedTests}`);
  console.log(`Success rate: ${summary.successRate}`);
  console.log(`Test execution time: ${summary.totalDuration}`);
  console.log(`Total time: ${summary.totalTime}`);
  console.log("------------------------------------");

  // Wait for any pending operations to complete
  await helpers.delay(1000);
});
