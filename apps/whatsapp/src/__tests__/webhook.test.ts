import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../index.js";

describe("GET /webhook/whatsapp (Meta verification)", () => {
  const server = buildServer();
  beforeAll(() => { process.env.VERIFY_TOKEN = "test-token"; });
  afterAll(async () => server.close());

  it("returns the hub.challenge when verify token matches", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=abc123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("abc123");
  });

  it("returns 403 when verify token does not match", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123",
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("POST /webhook/whatsapp (incoming message)", () => {
  const server = buildServer();
  afterAll(async () => server.close());

  it("returns 200 for a valid webhook payload", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/webhook/whatsapp",
      payload: {
        object: "whatsapp_business_account",
        entry: [],
      },
    });
    expect(res.statusCode).toBe(200);
  });

  it("returns 400 when object is not whatsapp_business_account", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/webhook/whatsapp",
      payload: { object: "instagram", entry: [] },
    });
    expect(res.statusCode).toBe(400);
  });
});
