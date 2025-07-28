/**
 * TestCase - A class to structure API tests in a clear, reusable way
 */
class TestCase {
  constructor(options = {}) {
    this.name = options.name || "Unnamed Test";
    this.method = options.method || "get";
    this.path = options.path || "/";
    this.body = options.body || null;
    this.token = options.token || null;
    this.expectedStatus = options.expectedStatus || [200];
    this.setup = options.setup || (() => Promise.resolve());
    this.teardown = options.teardown || (() => Promise.resolve());
    this.validation = options.validation || (() => true);
    this.maxAttempts = options.maxAttempts || 3;
    this.context = options.context || {};

    // Keep state between steps
    this._response = null;
  }

  // Set the auth token
  withToken(token) {
    this.token = token;
    return this;
  }

  // Set request body
  withBody(body) {
    this.body = body;
    return this;
  }

  // Set context values
  withContext(context) {
    this.context = { ...this.context, ...context };
    return this;
  }

  // Add validation function
  withValidation(fn) {
    this.validation = fn;
    return this;
  }

  // Execute the test case
  async execute(app, helpers) {
    console.log(`Running test case: ${this.name}`);

    try {
      // Run setup
      await this.setup(this.context);

      // Run the request
      this._response = await helpers.retryRequest(
        app,
        this.method,
        this.path,
        this.token,
        this.body,
        this.maxAttempts
      );

      // Check status code
      if (Array.isArray(this.expectedStatus)) {
        expect(this.expectedStatus).toContain(this._response.statusCode);
      } else if (this.expectedStatus) {
        expect(this._response.statusCode).toBe(this.expectedStatus);
      }

      // Run validation
      await this.validation(this._response, this.context);

      // Run teardown
      await this.teardown(this.context, this._response);

      return {
        success: true,
        response: this._response,
        context: this.context,
      };
    } catch (error) {
      console.error(`Test case "${this.name}" failed:`, error);
      return {
        success: false,
        error,
        response: this._response,
        context: this.context,
      };
    }
  }

  // Get the response (after execute)
  get response() {
    return this._response;
  }
}

module.exports = TestCase;
