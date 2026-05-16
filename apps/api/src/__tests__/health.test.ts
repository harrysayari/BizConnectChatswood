import { describe, it, expect } from "vitest";
import { buildServer } from "../index.js";

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const server = buildServer();
    const response = await server.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: "ok" });
  });
});
