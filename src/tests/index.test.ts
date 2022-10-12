import request from "supertest";

import server from "../../src/server";

describe("User routes", () => {
  test("Get all users", async () => {
    const res = await request(server).get("/users");
    expect(res.body).toEqual(["Goon", "Tsuki", "Joe"]);
  });
});

