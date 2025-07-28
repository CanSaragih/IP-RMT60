// Global Jest setup file

// Import helpers to make them available globally
const helpers = require("./__test__/test-helpers");

// Add global delay function (useful to have in global scope)
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Add custom matchers
expect.extend({
  toBeSuccessResponse(received) {
    const pass = received.statusCode >= 200 && received.statusCode < 300;
    return {
      pass,
      message: () =>
        `expected response status ${received.statusCode} to ${
          pass ? "not " : ""
        }be a success status (2xx)`,
    };
  },
  toBeErrorResponse(received) {
    const pass = received.statusCode >= 400;
    return {
      pass,
      message: () =>
        `expected response status ${received.statusCode} to ${
          pass ? "not " : ""
        }be an error status (4xx or 5xx)`,
    };
  },
  toHaveResponseProperty(received, property) {
    const pass = helpers.hasProperty(received.body, property);
    return {
      pass,
      message: () =>
        `expected response body to ${
          pass ? "not " : ""
        }have property '${property}'`,
    };
  },
});

// Increase timeout for all tests
jest.setTimeout(30000);

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
  originalConsoleError(...args);
};

// Add beforeAll to give extra time between test suites
beforeAll(async () => {
  // Wait a moment before starting tests
  await helpers.delay(1000);
});

// Add afterAll to clean up
afterAll(async () => {
  // Add any cleanup needed
  await helpers.delay(1000);
});
