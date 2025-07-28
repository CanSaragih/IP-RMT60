const request = require("supertest");

// Advanced test helpers with builder patterns
module.exports = {
  // Retry a request multiple times until it succeeds
  async retryRequest(
    app,
    method,
    path,
    token,
    body,
    maxAttempts = 3,
    delayMs = 500
  ) {
    let lastError;
    let lastResponse;

    // For expected error cases, just do one attempt and return whatever we get
    if (maxAttempts === 1) {
      const req = request(app)[method](path);

      if (token) {
        req.set("access_token", token);
      }

      if (
        body &&
        (method === "post" || method === "put" || method === "delete")
      ) {
        req.send(body);
      }

      try {
        return await req;
      } catch (err) {
        // Return a mock response for network errors
        return {
          statusCode: 500,
          body: { error: err.message },
        };
      }
    }

    // Normal retry logic for expected success cases
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        let req = request(app)[method](path);

        if (token) {
          req.set("access_token", token);
        }

        if (
          body &&
          (method === "post" || method === "put" || method === "delete")
        ) {
          req.send(body);
        }

        const res = await req;
        lastResponse = res;

        // For GET requests, any response is acceptable for retry purposes
        if (method === "get") {
          return res;
        }

        // For other methods, only 2xx responses are considered successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return res;
        }

        // If we get a 404 on DELETE, it may be already deleted - consider it success
        if (method === "delete" && res.statusCode === 404) {
          return res;
        }

        // Otherwise record the error and try again
        lastError = new Error(`Request failed with status ${res.statusCode}`);
        lastError.response = res;
      } catch (err) {
        lastError = err;
      }

      // Wait before retrying
      await this.delay(delayMs);
    }

    // If we got here, all attempts failed - return the last response anyway
    if (lastResponse) {
      return lastResponse;
    }

    // If we have no response at all, throw the error
    throw lastError || new Error("All retry attempts failed");
  },

  // Moved delay function to helpers for reuse
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // Setup a test user and get access token
  async setupTestUser(app, emailPrefix) {
    const uniqueId = Date.now();
    const email = `${emailPrefix}${uniqueId}@example.com`;
    const password = "password123";

    try {
      // Try to register a new user
      await this.retryRequest(app, "post", "/register", null, {
        email,
        password,
        name: `${emailPrefix} Test User`,
      });

      // Wait a bit for registration to complete
      await this.delay(1000);

      // Try to login
      const loginRes = await this.retryRequest(app, "post", "/login", null, {
        email,
        password,
      });

      // Extract token with fallbacks
      let token = null;
      if (loginRes.body && loginRes.body.access_token) {
        token = loginRes.body.access_token;
      } else if (loginRes.body && loginRes.body.token) {
        token = loginRes.body.token;
      } else if (loginRes.body && typeof loginRes.body === "object") {
        // Look for any property that might contain a token
        for (const key in loginRes.body) {
          if (
            typeof loginRes.body[key] === "string" &&
            (key.includes("token") || loginRes.body[key].length > 30)
          ) {
            token = loginRes.body[key];
            break;
          }
        }
      }

      return {
        email,
        password,
        token,
        userId: this.extractId(loginRes),
      };
    } catch (error) {
      console.error(`Failed to setup test user ${email}:`, error);
      return { email, password, token: null, userId: null };
    }
  },

  // New method: Create test resource and retry until success
  async createTestResource(app, token, endpoint, data) {
    const res = await this.retryRequest(app, "post", endpoint, token, data);

    // Wait for resource creation
    await this.delay(500);

    return {
      id: this.extractId(res),
      response: res,
    };
  },

  // New method: Validate response with custom expectations
  validateResponse(res, expectations) {
    if (expectations.statusCode) {
      if (Array.isArray(expectations.statusCode)) {
        expect(expectations.statusCode).toContain(res.statusCode);
      } else {
        expect(res.statusCode).toBe(expectations.statusCode);
      }
    }

    if (expectations.hasProperty) {
      for (const prop of expectations.hasProperty) {
        expect(this.hasProperty(res.body, prop)).toBe(true);
      }
    }

    return true;
  },

  // Extract ID from various response formats
  extractId(response) {
    if (!response || !response.body) return null;

    // Check common patterns
    if (response.body.id) {
      return response.body.id;
    }

    if (response.body.trip && response.body.trip.id) {
      return response.body.trip.id;
    }

    if (response.body.destination && response.body.destination.id) {
      return response.body.destination.id;
    }

    if (response.body.data && response.body.data.id) {
      return response.body.data.id;
    }

    // Also try to find an id in an array response
    if (Array.isArray(response.body) && response.body.length > 0) {
      const firstItem = response.body[0];
      if (firstItem && firstItem.id) {
        return firstItem.id;
      }
    }

    // Try to find any property ending with 'Id'
    for (const key in response.body) {
      if (key.endsWith("Id") && typeof response.body[key] === "number") {
        return response.body[key];
      }
    }

    // Search the entire response for an ID
    const bodyStr = JSON.stringify(response.body);
    const idMatch = bodyStr.match(/"id":\s*(\d+)/);
    if (idMatch && idMatch[1]) {
      return parseInt(idMatch[1], 10);
    }

    // Try parsing the response body if it's a string
    if (typeof response.body === "string") {
      try {
        const parsed = JSON.parse(response.body);
        if (parsed && parsed.id) {
          return parsed.id;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    return null;
  },

  // Check if a response has a specific property at any level of nesting
  hasProperty(obj, propName) {
    if (!obj || typeof obj !== "object") return false;

    if (obj[propName] !== undefined) return true;

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (this.hasProperty(obj[key], propName)) return true;
      }
    }

    return false;
  },

  // Flexible assertion for arrays in responses
  assertArrayResponse(res) {
    if (!res || !res.body) return false;

    if (Array.isArray(res.body)) {
      return true;
    }

    // Check common array properties
    for (const prop of ["data", "results", "items", "trips", "destinations"]) {
      if (Array.isArray(res.body[prop])) {
        return true;
      }
    }

    // If it's an object with numeric keys, it might be an array-like object
    if (res.body && typeof res.body === "object") {
      const keys = Object.keys(res.body);
      if (keys.length > 0 && keys.every((k) => !isNaN(k))) {
        return true;
      }
    }

    return false;
  },

  // Skip tests when a condition is not met
  skipTestIf(condition, message = "Test skipped") {
    if (condition) {
      console.warn(message);
      return true;
    }
    return false;
  },

  // Create a fallback token for tests if the normal login fails
  getHardcodedToken() {
    // This is a fallback token that can be used if the login process fails
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MTIzNDU2Nzh9.RfRz9U0DRn0xZH7wKfVwh8cP0PiLKCWjPiUw5dHfYQE";
  },

  // Builder pattern for API requests
  requestBuilder(app) {
    const builder = {
      _app: app,
      _method: "get",
      _path: "/",
      _token: null,
      _body: null,
      _maxAttempts: 3,
      _delayMs: 500,
      _expectedStatus: null,
      _responseValidator: null,

      // Method setters
      method(method) {
        this._method = method;
        return this;
      },
      get() {
        return this.method("get");
      },
      post() {
        return this.method("post");
      },
      put() {
        return this.method("put");
      },
      delete() {
        return this.method("delete");
      },

      // Path setter
      path(path) {
        this._path = path;
        return this;
      },

      // Auth token setter
      withToken(token) {
        this._token = token;
        return this;
      },

      // Body setter
      withBody(body) {
        this._body = body;
        return this;
      },

      // Retry parameters
      withRetry(attempts, delay) {
        this._maxAttempts = attempts;
        if (delay) this._delayMs = delay;
        return this;
      },

      // Expected status code
      expectStatus(code) {
        this._expectedStatus = code;
        return this;
      },

      // Custom validator
      withValidator(validatorFn) {
        this._responseValidator = validatorFn;
        return this;
      },

      // Execute the request
      async execute() {
        const res = await module.exports.retryRequest(
          this._app,
          this._method,
          this._path,
          this._token,
          this._body,
          this._maxAttempts,
          this._delayMs
        );

        // Validate status code if specified
        if (this._expectedStatus) {
          if (Array.isArray(this._expectedStatus)) {
            expect(this._expectedStatus).toContain(res.statusCode);
          } else {
            expect(res.statusCode).toBe(this._expectedStatus);
          }
        }

        // Run custom validator if provided
        if (this._responseValidator) {
          this._responseValidator(res);
        }

        return res;
      },
    };

    return builder;
  },

  // Test data generator for common objects
  generateTestData() {
    const uniqueId = Date.now();
    return {
      user: (prefix = "user") => ({
        email: `${prefix}${uniqueId}@example.com`,
        password: "password123",
        name: `${
          prefix.charAt(0).toUpperCase() + prefix.slice(1)
        } User ${uniqueId}`,
      }),

      trip: (prefix = "trip") => ({
        name: `${
          prefix.charAt(0).toUpperCase() + prefix.slice(1)
        } Trip ${uniqueId}`,
        startDate: "2023-10-01",
        endDate: "2023-10-10",
        destinationId: 1,
      }),

      destination: (prefix = "dest") => ({
        name: `${
          prefix.charAt(0).toUpperCase() + prefix.slice(1)
        } Destination ${uniqueId}`,
        country: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} Country`,
        description: `This is a test ${prefix} destination`,
        imageUrl: `https://example.com/${prefix}${uniqueId}.jpg`,
      }),
    };
  },

  // Async test flow controller for managing complex test dependencies
  testFlow() {
    const steps = [];
    const state = {};

    return {
      // Add a step to the flow
      addStep(name, fn) {
        steps.push({ name, fn });
        return this;
      },

      // Add step that depends on previous step
      addDependentStep(name, dependsOnStep, fn) {
        steps.push({
          name,
          fn,
          skipIf: () => !state[dependsOnStep],
        });
        return this;
      },

      // Update shared state
      setState(key, value) {
        state[key] = value;
        return this;
      },

      // Get state value
      getState(key) {
        return state[key];
      },

      // Execute all steps
      async execute() {
        for (const step of steps) {
          // Check if we should skip this step
          if (step.skipIf && step.skipIf()) {
            console.warn(`Skipping step "${step.name}" - dependency not met`);
            continue;
          }

          try {
            console.log(`Executing step: ${step.name}`);
            const result = await step.fn(state);

            // If step returns a key-value pair, add it to state
            if (result && typeof result === "object") {
              Object.assign(state, result);
            }
          } catch (error) {
            console.error(`Error in step "${step.name}":`, error);
            throw error;
          }
        }

        return state;
      },
    };
  },

  // Smart assertion for response bodies
  smartExpect(res) {
    return {
      toBeSuccessful() {
        expect(res.statusCode).toBeGreaterThanOrEqual(200);
        expect(res.statusCode).toBeLessThan(300);
        return this;
      },

      toBeClientError() {
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.statusCode).toBeLessThan(500);
        return this;
      },

      toBeServerError() {
        expect(res.statusCode).toBeGreaterThanOrEqual(500);
        return this;
      },

      toHaveBodyProperty(path) {
        const getProp = (obj, path) => {
          const parts = path.split(".");
          let current = obj;

          for (const part of parts) {
            if (current === null || current === undefined) return undefined;
            current = current[part];
          }

          return current;
        };

        const value = getProp(res.body, path);
        expect(value).toBeDefined();
        return this;
      },

      toMatchBodySnapshot(snapshotName) {
        expect(res.body).toMatchSnapshot(snapshotName);
        return this;
      },
    };
  },
};
