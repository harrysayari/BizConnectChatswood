import { describe, it, expect, afterAll } from "vitest";
import { buildServer } from "../index.js";

describe("GET /health", () => {
  const server = buildServer();

  afterAll(async () => {
    await server.close();
  });

  it("returns 200 with status ok", async () => {
    const response = await server.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: "ok" });
  });
});
