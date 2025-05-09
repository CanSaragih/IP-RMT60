// Test environment setup

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

// Also make console.warn less noisy
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Only show important warnings
  const message = args.join(" ");
  if (message.startsWith("Skipping test")) {
    // Suppress test skip messages
    return;
  }
  originalConsoleWarn(...args);
};

// Add a global beforeAll to give extra time between test suites
beforeAll(async () => {
  // Wait a moment before starting tests
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
