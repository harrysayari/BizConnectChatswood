import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildServer } from "../index.js";

vi.mock("../db/client.js", () => ({
  db: vi.fn(),
}));

import { db } from "../db/client.js";
const mockDb = db as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe("POST /alerts", () => {
  it("returns 201 with new alert id", async () => {
    mockDb.mockResolvedValueOnce([{ id: "alert-1" }]);
    const server = buildServer();
    const res = await server.inject({
      method: "POST",
      url: "/alerts",
      payload: {
        title: "Roadworks",
        body: "Victoria Ave closed Monday",
        polygon: {
          type: "Polygon",
          coordinates: [[[151.18, -33.80], [151.19, -33.80], [151.19, -33.79], [151.18, -33.79], [151.18, -33.80]]],
        },
        created_by: null,
      },
    });
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toHaveProperty("id");
  });
});

describe("POST /alerts/:id/send", () => {
  it("returns 200 with matched business count", async () => {
    mockDb
      .mockResolvedValueOnce([{ id: "alert-1", polygon: "{}", title: "Test", body: "Test", sent_at: null }])
      .mockResolvedValueOnce([{ id: "biz-1", phone: "+61400000000", name: "Shop" }])
      .mockResolvedValueOnce([]);
    const server = buildServer();
    const res = await server.inject({ method: "POST", url: "/alerts/alert-1/send" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toHaveProperty("matched");
  });
});

describe("POST /issues", () => {
  it("returns 201 with new issue id", async () => {
    mockDb.mockResolvedValueOnce([{ id: "issue-1" }]);
    const server = buildServer();
    const res = await server.inject({
      method: "POST",
      url: "/issues",
      payload: {
        business_id: "123e4567-e89b-12d3-a456-426614174000",
        category: "graffiti",
        description: "Graffiti on wall",
        location: { type: "Point", coordinates: [151.1836, -33.7969] },
      },
    });
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toHaveProperty("id");
  });
});

describe("PUT /issues/:id/status", () => {
  it("returns 200 on status update", async () => {
    mockDb.mockResolvedValueOnce([]);
    const server = buildServer();
    const res = await server.inject({
      method: "PUT",
      url: "/issues/issue-1/status",
      payload: { status: "resolved" },
    });
    expect(res.statusCode).toBe(200);
  });
});
