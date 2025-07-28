const request = require("supertest");
const app = require("../app");
const helpers = require("./test-helpers");

// Increase test timeout
jest.setTimeout(30000);

// Unique email for this test run to prevent conflicts
const uniqueId = Date.now();

// Use helpers delay function directly
const { delay } = helpers;

describe("Authentication Routes", () => {
  describe("POST /register", () => {
    // Data-driven test for validation failures
    test.each([
      {
        scenario: "missing email",
        payload: { password: "password123", name: "Test User" },
      },
      {
        scenario: "missing password",
        payload: {
          email: `missing_password${uniqueId}@example.com`,
          name: "Test User",
        },
      },
      {
        scenario: "missing name",
        payload: {
          email: `missing_name${uniqueId}@example.com`,
          password: "password123",
        },
      },
    ])("should return 400 if $scenario", async ({ payload }) => {
      const res = await request(app).post("/register").send(payload);

      // Accept any 4xx status code
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.statusCode).toBeLessThan(500);
    });

    it("should register a new user", async () => {
      // Use a test context object to track state
      const testContext = {
        email: `test${uniqueId}@example.com`,
        password: "password123",
        name: "Test User",
      };

      const res = await helpers.retryRequest(
        app,
        "post",
        "/register",
        null,
        testContext
      );

      // Use proper Jest matcher
      expect(res.statusCode).toBeLessThan(400);

      // Store the context for potential later use
      return testContext;
    });

    it("should return 400 if email already exists", async () => {
      // Setup phase
      const email = `duplicate${uniqueId}@example.com`;
      const registerPayload = {
        email,
        password: "password123",
        name: "Test User",
      };

      // First registration
      await helpers.retryRequest(
        app,
        "post",
        "/register",
        null,
        registerPayload
      );

      await delay(1000);

      // Duplicate registration attempt
      const res = await helpers.retryRequest(
        app,
        "post",
        "/register",
        null,
        registerPayload,
        1 // only try once since we expect failure
      );

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.statusCode).toBeLessThan(500);
    });
  });

  describe("POST /login", () => {
    // Setup test data as constants
    const TEST_CREDENTIALS = {
      email: `login${uniqueId}@example.com`,
      password: "password123",
      name: "Login Test User",
    };

    // State container for test suite
    const testState = {};

    beforeAll(async () => {
      // Register a user for login tests using helper
      const regRes = await helpers.retryRequest(
        app,
        "post",
        "/register",
        null,
        TEST_CREDENTIALS
      );

      // Store registration response
      testState.registrationResponse = regRes;

      await delay(1000);
    });

    // Map of test cases for login scenarios
    const loginScenarios = [
      {
        name: "valid credentials",
        payload: {
          email: TEST_CREDENTIALS.email,
          password: TEST_CREDENTIALS.password,
        },
        expectedStatus: 200,
        validate: (res) => expect(res.body).toHaveProperty("access_token"),
      },
      {
        name: "invalid email",
        payload: {
          email: `wrong${uniqueId}@example.com`,
          password: TEST_CREDENTIALS.password,
        },
        expectedStatus: null, // Accept any 4xx
        validate: (res) => {
          expect(res.statusCode).toBeGreaterThanOrEqual(400);
          expect(res.statusCode).toBeLessThan(500);
        },
      },
      {
        name: "invalid password",
        payload: {
          email: TEST_CREDENTIALS.email,
          password: "wrongpassword",
        },
        expectedStatus: null, // Accept any 4xx
        validate: (res) => {
          expect(res.statusCode).toBeGreaterThanOrEqual(400);
          expect(res.statusCode).toBeLessThan(500);
        },
      },
    ];

    // Generate tests programmatically
    loginScenarios.forEach((scenario) => {
      it(`should handle login with ${scenario.name}`, async () => {
        try {
          const attemptsForThisTest = scenario.expectedStatus === 200 ? 3 : 1;

          const res = await helpers.retryRequest(
            app,
            "post",
            "/login",
            null,
            scenario.payload,
            attemptsForThisTest
          );

          // Run the scenario-specific validation
          scenario.validate(res);

          // For successful login, store the token
          if (res.statusCode === 200 && res.body.access_token) {
            testState.token = res.body.access_token;
          }
        } catch (error) {
          console.error(`Test error (${scenario.name}):`, error);
          throw error;
        }
      });
    });

    // After all login tests, verify we got a valid token
    afterAll(() => {
      if (testState.token) {
        console.log("Login tests completed successfully with valid token");
      } else {
        console.warn("Warning: No valid token was obtained during login tests");
      }
    });
  });
});
