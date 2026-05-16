import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildServer } from "../index.js";

vi.mock("../db/client.js", () => ({
  db: vi.fn(),
}));

import { db } from "../db/client.js";
const mockDb = db as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe("GET /businesses", () => {
  it("returns an array of businesses", async () => {
    mockDb.mockResolvedValueOnce([{ id: "abc", name: "Test Shop" }]);
    const server = buildServer();
    const res = await server.inject({ method: "GET", url: "/businesses" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([{ id: "abc", name: "Test Shop" }]);
  });
});

describe("GET /businesses/:id", () => {
  it("returns 200 when business found", async () => {
    mockDb.mockResolvedValueOnce([{ id: "abc", name: "Test Shop" }]);
    const server = buildServer();
    const res = await server.inject({ method: "GET", url: "/businesses/abc" });
    expect(res.statusCode).toBe(200);
  });

  it("returns 404 when business not found", async () => {
    mockDb.mockResolvedValueOnce([]);
    const server = buildServer();
    const res = await server.inject({ method: "GET", url: "/businesses/missing" });
    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /businesses/:id", () => {
  it("returns 200 on successful update", async () => {
    mockDb.mockResolvedValueOnce([]);
    const server = buildServer();
    const res = await server.inject({
      method: "PUT",
      url: "/businesses/abc",
      payload: { name: "Updated Shop", services: ["coffee"] },
    });
    expect(res.statusCode).toBe(200);
  });
});
