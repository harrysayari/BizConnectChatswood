import { describe, it, expect } from "vitest";
import { BusinessSchema, AlertSchema, IssueSchema } from "../index.js";

const validBusiness = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Sydney Bakery",
  phone: "+61400000000",
  address: "1 Victoria Ave, Chatswood NSW 2067",
  location: { type: "Point" as const, coordinates: [151.1836, -33.7969] as [number, number] },
  services: ["coffee", "pastries"],
  verified_at: null,
  last_heartbeat_at: null,
};

describe("BusinessSchema", () => {
  it("parses a valid business", () => {
    expect(() => BusinessSchema.parse(validBusiness)).not.toThrow();
  });
  it("rejects a business missing required fields", () => {
    expect(() => BusinessSchema.parse({ id: validBusiness.id })).toThrow();
  });
  it("rejects a non-Point location", () => {
    expect(() =>
      BusinessSchema.parse({ ...validBusiness, location: { type: "LineString", coordinates: [] } })
    ).toThrow();
  });
});

describe("AlertSchema", () => {
  it("parses a valid alert", () => {
    const input = {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Road closure",
      body: "Victoria Ave closed Monday 9am–5pm",
      polygon: {
        type: "Polygon" as const,
        coordinates: [[[151.18, -33.80], [151.19, -33.80], [151.19, -33.79], [151.18, -33.79], [151.18, -33.80]]],
      },
      sent_at: null,
      created_by: null,
    };
    expect(() => AlertSchema.parse(input)).not.toThrow();
  });
});

describe("IssueSchema", () => {
  it("parses a valid issue", () => {
    const input = {
      id: "123e4567-e89b-12d3-a456-426614174002",
      business_id: validBusiness.id,
      category: "graffiti" as const,
      description: "Graffiti on wall outside store",
      status: "open" as const,
      location: { type: "Point" as const, coordinates: [151.1836, -33.7969] as [number, number] },
      resolved_at: null,
    };
    expect(() => IssueSchema.parse(input)).not.toThrow();
  });
  it("rejects an invalid status", () => {
    expect(() =>
      IssueSchema.parse({ status: "flying" })
    ).toThrow();
  });
});
