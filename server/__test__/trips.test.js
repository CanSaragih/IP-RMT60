// __tests__/trip.test.js
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ2MTMxNTY3fQ.UX4jCYYUNXxOdjIydfs6a09eQncB9g0O7NPCW0jtplU";
});

describe("Trip Routes", () => {
  describe("GET /trips", () => {
    it("should return a list of trips", async () => {
      const res = await request(app)
        .get("/trips")
        .set("access_token", access_token);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /trips", () => {
    it("should create a new trip", async () => {
      const res = await request(app)
        .post("/trips")
        .set("access_token", access_token)
        .send({
          name: "Test Trip",
          startDate: "2023-10-01",
          endDate: "2023-10-10",
          destinationId: 1,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
    });
  });

  describe("DELETE /trips/:id", () => {
    it("should delete a trip by ID", async () => {
      const res = await request(app)
        .delete("/trips/1")
        .set("access_token", access_token);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Trip deleted successfully");
    });
  });
});
