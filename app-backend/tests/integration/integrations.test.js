import request from "supertest";
import { describe, it, expect, beforeAll, vi, afterAll } from "vitest";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js";
import initApp from "../../app.js";

const testUser = {
  id: 1,
  email: "jeremy_robson@fake.com",
};

const token = jwt.sign(testUser, process.env.JWT_SECRET, {
  algorithm: "HS256",
  expiresIn: "1h",
});

let app;

beforeAll(async () => {
  logger.info("Initializing App");
  app = await initApp();
});

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new_user@fake.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jeremy_robson@fake.com",
      loginPassword: "jeremy_pswd",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
  });
});

describe("Task Routes", () => {
  it("should get tasks with valid token", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a task with valid token", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: "Daily",
        title: "Write tests",
        duration: 30,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
