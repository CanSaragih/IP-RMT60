const request = require("supertest");
const app = require("../app");

describe("Public Routes", () => {
  describe("GET /pub/destinations", () => {
    it("should return a list of public destinations", async () => {
      const res = await request(app).get("/pub/destinations");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /pub/destinations/:id", () => {
    it("should return a destination by ID", async () => {
      const res = await request(app).get("/pub/destinations/1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
    });
  });
  describe("POST /login/google", () => {
    it("should return a token on successful login", async () => {
      const res = await request(app).post("/login/google").send({
        id_token: "test_token",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("access_token");
    });
  });
});
