import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Authorization Tests
describe("Auth Logic Unit Tests", () => {
  describe("Password Hashing", () => {
    it("should correctly hash and verify a password", async () => {
      const password = "my_secure_password";
      const saltRounds = 10;

      const hash = await bcrypt.hash(password, saltRounds);
      const isMatch = await bcrypt.compare(password, hash);

      expect(isMatch).toBe(true);
    });

    it("should fail when comparing incorrect password", async () => {
      const password = "correct_password";
      const wrongPassword = "wrong_password";
      const saltRounds = 10;

      const hash = await bcrypt.hash(password, saltRounds);
      const isMatch = await bcrypt.compare(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });

  describe("JWT Token Creation and Verification", () => {
    const payload = { id: 1, email: "user@example.com" };
    const secret = "test_jwt_secret";

    it("should create a valid JWT token", () => {
      const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      expect(typeof token).toBe("string");
    });

    it("should verify and decode a valid JWT token", () => {
      const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      const decoded = jwt.verify(token, secret);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.id).toBe(payload.id);
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.value";
      expect(() => jwt.verify(invalidToken, secret)).toThrow();
    });
  });
});
