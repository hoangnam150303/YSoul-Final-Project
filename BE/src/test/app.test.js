const request = require("supertest");
const app = require("./app"); // Adjust the path to your server file
require("dotenv").config();

describe("POST /api/v1/auth/loginLocal", () => {
  it("should return 200 and access_token for valid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/loginLocal").send({
      email: "hoangnam150303@gmail.com",
      password: "11111111",
    });

    console.log("✅ VALID LOGIN:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.access_token).toBeDefined();
  });

  it("should return 401 for invalid password", async () => {
    const response = await request(app).post("/api/v1/auth/loginLocal").send({
      email: "hoangnam150303@gmail.com",
      password: "wrongpassword",
    });

    console.log("⚠️ WRONG PASSWORD:", response.body);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Password is incorrect.");
  });

  it("should return 404 for non-existent user", async () => {
    const response = await request(app).post("/api/v1/auth/loginLocal").send({
      email: "nonexistent@example.com",
      password: "whatever",
    });

    console.log("❌ NON-EXISTENT USER:", response.body);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("User not found");
  });
});
