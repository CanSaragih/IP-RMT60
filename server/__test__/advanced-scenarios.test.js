const request = require("supertest");
const app = require("../app");
const helpers = require("./test-helpers");
const TestCase = require("./utils/TestCase");

// Increase test timeout
jest.setTimeout(30000);

describe("Advanced Test Scenarios", () => {
  // Create a suite context to share data
  const testContext = {
    uniqueId: Date.now(),
    user: null,
    token: null,
    destinationId: null,
    tripId: null,
  };

  beforeAll(async () => {
    // Setup a user account
    testContext.user = helpers.generateTestData().user("advanced");

    // Register the user
    const registerCase = new TestCase({
      name: "Register test user",
      method: "post",
      path: "/register",
      body: testContext.user,
      expectedStatus: [200, 201],
      context: testContext,
    });

    await registerCase.execute(app, helpers);
    await helpers.delay(1000);

    // Login
    const loginCase = new TestCase({
      name: "Login test user",
      method: "post",
      path: "/login",
      body: {
        email: testContext.user.email,
        password: testContext.user.password,
      },
      expectedStatus: 200,
      validation: (res, ctx) => {
        expect(res.body).toHaveProperty("access_token");
        ctx.token = res.body.access_token;
      },
      context: testContext,
    });

    await loginCase.execute(app, helpers);
  });

  // Create an end-to-end test flow using the TestCase class
  describe("End-to-end Travel Planning", () => {
    it("should complete a full travel planning cycle", async () => {
      if (!testContext.token) {
        console.warn("Skipping test - no auth token available");
        return;
      }

      // Step 1: Create a destination
      const createDestination = new TestCase({
        name: "Create destination",
        method: "post",
        path: "/destinations",
        body: helpers.generateTestData().destination("e2e"),
        token: testContext.token,
        expectedStatus: [200, 201],
        validation: (res, ctx) => {
          ctx.destinationId = helpers.extractId(res);
          expect(ctx.destinationId).toBeTruthy();
        },
        context: testContext,
      });

      const destResult = await createDestination.execute(app, helpers);
      expect(destResult.success).toBe(true);

      await helpers.delay(500);

      // Step 2: Create a trip using the destination
      const createTrip = new TestCase({
        name: "Create trip",
        method: "post",
        path: "/trips",
        token: testContext.token,
        body: {
          ...helpers.generateTestData().trip("e2e"),
          destinationId: testContext.destinationId,
        },
        expectedStatus: [200, 201],
        validation: (res, ctx) => {
          ctx.tripId = helpers.extractId(res);
          expect(ctx.tripId).toBeTruthy();
        },
        context: testContext,
      });

      const tripResult = await createTrip.execute(app, helpers);
      expect(tripResult.success).toBe(true);

      await helpers.delay(500);

      // Step 3: Fetch trip details
      const getTrip = new TestCase({
        name: "Get trip details",
        method: "get",
        path: `/trips/${testContext.tripId}`,
        token: testContext.token,
        expectedStatus: 200,
        validation: (res) => {
          expect(res.body).toBeTruthy();
          const trip = res.body.trip || res.body;
          expect(trip).toBeTruthy();
          expect(trip.destinationId).toBe(testContext.destinationId);
        },
        context: testContext,
      });

      const getTripResult = await getTrip.execute(app, helpers);
      expect(getTripResult.success).toBe(true);

      await helpers.delay(500);

      // Step 4: Update the trip
      const updateTrip = new TestCase({
        name: "Update trip",
        method: "put",
        path: `/trips/${testContext.tripId}`,
        token: testContext.token,
        body: {
          name: `Updated E2E Trip ${testContext.uniqueId}`,
          startDate: "2023-12-01",
          endDate: "2023-12-10",
          destinationId: testContext.destinationId,
        },
        expectedStatus: [200, 204],
        context: testContext,
      });

      const updateResult = await updateTrip.execute(app, helpers);
      expect(updateResult.success).toBe(true);

      await helpers.delay(500);

      // Step 5: Delete the trip
      const deleteTrip = new TestCase({
        name: "Delete trip",
        method: "delete",
        path: `/trips/${testContext.tripId}`,
        token: testContext.token,
        expectedStatus: [200, 202, 204],
        context: testContext,
      });

      const deleteResult = await deleteTrip.execute(app, helpers);
      expect(deleteResult.success).toBe(true);

      await helpers.delay(500);

      // Step 6: Delete the destination
      const deleteDestination = new TestCase({
        name: "Delete destination",
        method: "delete",
        path: `/destinations/${testContext.destinationId}`,
        token: testContext.token,
        expectedStatus: [200, 202, 204],
        context: testContext,
      });

      const deleteDest = await deleteDestination.execute(app, helpers);
      expect(deleteDest.success).toBe(true);
    });
  });
});
