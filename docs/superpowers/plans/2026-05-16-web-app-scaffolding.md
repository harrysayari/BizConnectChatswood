# Web App Scaffolding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a full-stack TypeScript monorepo with three apps (Council Dashboard, REST API, WhatsApp service) and a shared types package — all wired together and individually runnable.

**Architecture:** Turborepo + pnpm workspaces at the root; `packages/shared` holds Zod schemas that both frontend and backend consume; `apps/api` is the only app that touches the database, and `apps/whatsapp` calls it via HTTP.

**Tech Stack:** Turborepo 2, pnpm 9, TypeScript 5, Fastify 4, postgres.js 3, Zod 3, React 18, Vite 5, Mapbox GL JS 3, TanStack Query 5, React Router 6, Vitest 1

---

## File Map

```
BizConnectChatswood/
├── package.json                          root workspace scripts (dev, build, test)
├── pnpm-workspace.yaml                   workspace package globs
├── turbo.json                            pipeline: build → ^build, dev persistent
├── tsconfig.base.json                    strict TS config extended by all apps
├── .env.example                          all env vars across all apps documented
│
├── packages/shared/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                      re-exports all schemas + types
│   │   ├── schemas/business.ts           Business Zod schema + types
│   │   ├── schemas/alert.ts              Alert Zod schema + types
│   │   └── schemas/issue.ts             Issue Zod schema + types
│   └── src/__tests__/schemas.test.ts    unit tests for all schemas
│
├── apps/api/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── .env.example
│   └── src/
│       ├── index.ts                      buildServer() factory + main() entry
│       ├── db/client.ts                  postgres.js client (DATABASE_URL)
│       ├── routes/
│       │   ├── health.ts                 GET /health
│       │   ├── businesses.ts             GET /businesses, GET /:id, PUT /:id
│       │   ├── alerts.ts                 POST /alerts, POST /:id/send
│       │   └── issues.ts                POST /issues, PUT /:id/status
│       └── __tests__/
│           ├── health.test.ts
│           ├── businesses.test.ts
│           └── alerts-issues.test.ts
│
├── apps/web/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.tsx                      React root mount
│       ├── App.tsx                       QueryClientProvider + Router
│       ├── lib/api.ts                    typed fetch wrapper for apps/api
│       └── pages/Dashboard.tsx          Mapbox map + sidebar shell
│
└── apps/whatsapp/
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── .env.example
    └── src/
        ├── index.ts                      buildServer() + main()
        ├── webhook.ts                    POST /webhook/whatsapp route
        ├── client/api.ts                 HTTP client for apps/api
        └── __tests__/webhook.test.ts    webhook verification test
```

---

## Task 1: Root monorepo setup

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "bizconnect-chatswood",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.1.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

- [ ] **Step 4: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 5: Create .env.example documenting all vars**

```
# apps/api
DATABASE_URL=postgres://user:password@localhost:5432/bizconnect
PORT=3001

# apps/whatsapp
WHATSAPP_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_webhook_verify_token
API_BASE_URL=http://localhost:3001
PORT=3002

# apps/web
VITE_API_BASE_URL=http://localhost:3001
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

- [ ] **Step 6: Install turbo globally for the workspace and verify**

```bash
npm install -g pnpm@9
pnpm install
```

Expected: `node_modules/.modules.yaml` created at root; no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .env.example
git commit -m "feat: add monorepo root (Turborepo + pnpm workspaces)"
```

---

## Task 2: packages/shared — Zod schemas

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/schemas/business.ts`
- Create: `packages/shared/src/schemas/alert.ts`
- Create: `packages/shared/src/schemas/issue.ts`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/__tests__/schemas.test.ts`

- [ ] **Step 1: Write the failing schema tests**

Create `packages/shared/src/__tests__/schemas.test.ts`:

```typescript
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
```

- [ ] **Step 2: Create packages/shared/package.json**

```json
{
  "name": "@bizconnect/shared",
  "version": "0.0.1",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  }
}
```

- [ ] **Step 3: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Run the tests — they should fail (module not found)**

```bash
pnpm --filter @bizconnect/shared test
```

Expected: FAIL — `Cannot find module '../index.js'`

- [ ] **Step 5: Create packages/shared/src/schemas/business.ts**

```typescript
import { z } from "zod";

export const GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  location: GeoPointSchema,
  trading_hours: z.record(z.string()).optional(),
  services: z.array(z.string()),
  verified_at: z.string().datetime().nullable(),
  last_heartbeat_at: z.string().datetime().nullable(),
});

export type Business = z.infer<typeof BusinessSchema>;
export const UpdateBusinessSchema = BusinessSchema.partial().omit({ id: true });
export type UpdateBusiness = z.infer<typeof UpdateBusinessSchema>;
```

- [ ] **Step 6: Create packages/shared/src/schemas/alert.ts**

```typescript
import { z } from "zod";

export const GeoPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

export const AlertSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  polygon: GeoPolygonSchema,
  sent_at: z.string().datetime().nullable(),
  created_by: z.string().uuid().nullable(),
});

export type Alert = z.infer<typeof AlertSchema>;
export const CreateAlertSchema = AlertSchema.omit({ id: true, sent_at: true });
export type CreateAlert = z.infer<typeof CreateAlertSchema>;
```

- [ ] **Step 7: Create packages/shared/src/schemas/issue.ts**

```typescript
import { z } from "zod";
import { GeoPointSchema } from "./business.js";

export const IssueCategorySchema = z.enum([
  "street_lighting",
  "graffiti",
  "illegal_dumping",
  "road_damage",
  "other",
]);

export const IssueStatusSchema = z.enum(["open", "in_progress", "resolved"]);

export const IssueSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  category: IssueCategorySchema,
  description: z.string().min(1),
  status: IssueStatusSchema,
  location: GeoPointSchema,
  resolved_at: z.string().datetime().nullable(),
});

export type Issue = z.infer<typeof IssueSchema>;
export type IssueCategory = z.infer<typeof IssueCategorySchema>;
export type IssueStatus = z.infer<typeof IssueStatusSchema>;
export const CreateIssueSchema = IssueSchema.omit({ id: true, status: true, resolved_at: true });
export type CreateIssue = z.infer<typeof CreateIssueSchema>;
```

- [ ] **Step 8: Create packages/shared/src/index.ts**

```typescript
export * from "./schemas/business.js";
export * from "./schemas/alert.js";
export * from "./schemas/issue.js";
```

- [ ] **Step 9: Install deps and run tests — they should pass**

```bash
pnpm install
pnpm --filter @bizconnect/shared test
```

Expected: 6 tests PASS.

- [ ] **Step 10: Commit**

```bash
git add packages/
git commit -m "feat: add shared Zod schemas for Business, Alert, Issue"
```

---

## Task 3: apps/api — Fastify server + health route

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/vitest.config.ts`
- Create: `apps/api/.env.example`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/db/client.ts`
- Create: `apps/api/src/__tests__/health.test.ts`

- [ ] **Step 1: Write the failing health test**

Create `apps/api/src/__tests__/health.test.ts`:

```typescript
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
```

- [ ] **Step 2: Create apps/api/package.json**

```json
{
  "name": "@bizconnect/api",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "@bizconnect/shared": "workspace:*",
    "fastify": "^4.26.0",
    "@fastify/sensible": "^5.5.0",
    "postgres": "^3.4.3"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  }
}
```

- [ ] **Step 3: Create apps/api/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create apps/api/vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 5: Create apps/api/.env.example**

```
DATABASE_URL=postgres://user:password@localhost:5432/bizconnect
PORT=3001
```

- [ ] **Step 6: Create apps/api/src/db/client.ts**

```typescript
import postgres from "postgres";

export const db = postgres(process.env.DATABASE_URL ?? "postgres://localhost/bizconnect");
```

- [ ] **Step 7: Create apps/api/src/routes/health.ts**

```typescript
import type { FastifyPluginAsync } from "fastify";

export const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health", async () => ({ status: "ok" }));
};
```

- [ ] **Step 8: Create apps/api/src/index.ts**

```typescript
import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { healthRoute } from "./routes/health.js";
import { businessesRoute } from "./routes/businesses.js";
import { alertsRoute } from "./routes/alerts.js";
import { issuesRoute } from "./routes/issues.js";

export function buildServer() {
  const server = Fastify({ logger: process.env.NODE_ENV !== "test" });
  server.register(sensible);
  server.register(healthRoute);
  server.register(businessesRoute, { prefix: "/businesses" });
  server.register(alertsRoute, { prefix: "/alerts" });
  server.register(issuesRoute, { prefix: "/issues" });
  return server;
}

const isMain = process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js");
if (isMain) {
  const server = buildServer();
  await server.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
}
```

- [ ] **Step 9: Install deps and run health test**

```bash
pnpm install
pnpm --filter @bizconnect/api test
```

Expected: FAIL — `Cannot find module './routes/businesses.js'`

- [ ] **Step 10: Create stub route files so server builds**

Create `apps/api/src/routes/businesses.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
export const businessesRoute: FastifyPluginAsync = async () => {};
```

Create `apps/api/src/routes/alerts.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
export const alertsRoute: FastifyPluginAsync = async () => {};
```

Create `apps/api/src/routes/issues.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
export const issuesRoute: FastifyPluginAsync = async () => {};
```

- [ ] **Step 11: Run tests — they should now pass**

```bash
pnpm --filter @bizconnect/api test
```

Expected: 1 test PASS.

- [ ] **Step 12: Commit**

```bash
git add apps/api/
git commit -m "feat: scaffold apps/api Fastify server with health route"
```

---

## Task 4: apps/api — businesses routes

**Files:**
- Modify: `apps/api/src/routes/businesses.ts`
- Create: `apps/api/src/__tests__/businesses.test.ts`

- [ ] **Step 1: Write the failing businesses tests**

Create `apps/api/src/__tests__/businesses.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm --filter @bizconnect/api test
```

Expected: 4 new tests FAIL — routes return 404 (stubs are empty).

- [ ] **Step 3: Implement businesses routes**

Replace `apps/api/src/routes/businesses.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/client.js";
import { UpdateBusinessSchema } from "@bizconnect/shared";

export const businessesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return db`
      SELECT id, name, phone, address,
        ST_AsGeoJSON(location)::json AS location,
        trading_hours, services, verified_at, last_heartbeat_at
      FROM businesses
    `;
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const [row] = await db`
      SELECT id, name, phone, address,
        ST_AsGeoJSON(location)::json AS location,
        trading_hours, services, verified_at, last_heartbeat_at
      FROM businesses WHERE id = ${id}
    `;
    if (!row) return reply.notFound("Business not found");
    return row;
  });

  fastify.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const body = UpdateBusinessSchema.parse(request.body);
    await db`UPDATE businesses SET ${db(body as Record<string, unknown>)} WHERE id = ${id}`;
    return { success: true };
  });
};
```

- [ ] **Step 4: Run tests — they should pass**

```bash
pnpm --filter @bizconnect/api test
```

Expected: all 5 tests PASS (1 health + 4 businesses).

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/routes/businesses.ts apps/api/src/__tests__/businesses.test.ts
git commit -m "feat: add businesses CRUD routes to apps/api"
```

---

## Task 5: apps/api — alerts and issues routes

**Files:**
- Modify: `apps/api/src/routes/alerts.ts`
- Modify: `apps/api/src/routes/issues.ts`
- Create: `apps/api/src/__tests__/alerts-issues.test.ts`

- [ ] **Step 1: Write the failing alerts and issues tests**

Create `apps/api/src/__tests__/alerts-issues.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
pnpm --filter @bizconnect/api test
```

Expected: 4 new tests FAIL — stub routes return nothing.

- [ ] **Step 3: Implement alerts routes**

Replace `apps/api/src/routes/alerts.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/client.js";
import { CreateAlertSchema } from "@bizconnect/shared";

export const alertsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = CreateAlertSchema.parse(request.body);
    const [alert] = await db`
      INSERT INTO alerts (title, body, polygon, created_by)
      VALUES (
        ${body.title},
        ${body.body},
        ST_GeomFromGeoJSON(${JSON.stringify(body.polygon)}),
        ${body.created_by ?? null}
      )
      RETURNING id
    `;
    return reply.code(201).send(alert);
  });

  fastify.post<{ Params: { id: string } }>("/:id/send", async (request, reply) => {
    const { id } = request.params;
    const [alert] = await db`SELECT * FROM alerts WHERE id = ${id}`;
    if (!alert) return reply.notFound("Alert not found");

    const businesses = await db`
      SELECT id, phone, name FROM businesses
      WHERE ST_Within(location::geometry, ST_GeomFromGeoJSON(${alert.polygon})::geometry)
    `;

    await db`UPDATE alerts SET sent_at = NOW() WHERE id = ${id}`;

    // WhatsApp sends are triggered here — actual Meta API calls handled by apps/whatsapp
    return { matched: businesses.length, businessIds: businesses.map((b: { id: string }) => b.id) };
  });
};
```

- [ ] **Step 4: Implement issues routes**

Replace `apps/api/src/routes/issues.ts`:

```typescript
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { db } from "../db/client.js";
import { CreateIssueSchema, IssueStatusSchema } from "@bizconnect/shared";

export const issuesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = CreateIssueSchema.parse(request.body);
    const [issue] = await db`
      INSERT INTO issues (business_id, category, description, status, location)
      VALUES (
        ${body.business_id},
        ${body.category},
        ${body.description},
        'open',
        ST_GeomFromGeoJSON(${JSON.stringify(body.location)})
      )
      RETURNING id
    `;
    return reply.code(201).send(issue);
  });

  fastify.put<{ Params: { id: string } }>("/:id/status", async (request, reply) => {
    const { status } = z.object({ status: IssueStatusSchema }).parse(request.body);
    const resolved_at = status === "resolved" ? new Date().toISOString() : null;
    await db`
      UPDATE issues
      SET status = ${status}, resolved_at = ${resolved_at}
      WHERE id = ${(request.params as { id: string }).id}
    `;
    return { success: true };
  });
};
```

- [ ] **Step 5: Run all tests — they should all pass**

```bash
pnpm --filter @bizconnect/api test
```

Expected: 9 tests PASS (1 health + 4 businesses + 4 alerts/issues).

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/routes/alerts.ts apps/api/src/routes/issues.ts apps/api/src/__tests__/alerts-issues.test.ts
git commit -m "feat: add alerts and issues routes to apps/api"
```

---

## Task 6: apps/web — Vite + React + Mapbox dashboard

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/.env.example`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/pages/Dashboard.tsx`

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@bizconnect/web",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "tsc --noEmit"
  },
  "dependencies": {
    "@bizconnect/shared": "workspace:*",
    "@tanstack/react-query": "^5.18.0",
    "mapbox-gl": "^3.1.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^3.1.0",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.1"
  }
}
```

- [ ] **Step 2: Create apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create apps/web/vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
```

- [ ] **Step 4: Create apps/web/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BizConnect Chatswood — Council Dashboard</title>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create apps/web/.env.example**

```
VITE_API_BASE_URL=http://localhost:3001
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

- [ ] **Step 6: Create apps/web/src/lib/api.ts**

```typescript
import type { Business, Alert, CreateAlert, Issue, CreateIssue } from "@bizconnect/shared";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  businesses: {
    list: () => request<Business[]>("/businesses"),
    get: (id: string) => request<Business>(`/businesses/${id}`),
    update: (id: string, body: Partial<Business>) =>
      request<{ success: boolean }>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  },
  alerts: {
    create: (body: CreateAlert) =>
      request<{ id: string }>("/alerts", { method: "POST", body: JSON.stringify(body) }),
    send: (id: string) =>
      request<{ matched: number; businessIds: string[] }>(`/alerts/${id}/send`, { method: "POST" }),
  },
  issues: {
    create: (body: CreateIssue) =>
      request<{ id: string }>("/issues", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: Issue["status"]) =>
      request<{ success: boolean }>(`/issues/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  },
};
```

- [ ] **Step 7: Create apps/web/src/pages/Dashboard.tsx**

```typescript
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import { api } from "../lib/api.js";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

export function Dashboard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: api.businesses.list,
  });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [151.1836, -33.7969], // Chatswood
      zoom: 15,
    });
  }, []);

  useEffect(() => {
    if (!map.current || !businesses) return;
    businesses.forEach((business) => {
      new mapboxgl.Marker()
        .setLngLat(business.location.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setText(business.name))
        .addTo(map.current!);
    });
  }, [businesses]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 300, padding: 16, borderRight: "1px solid #eee", overflowY: "auto" }}>
        <h2>Businesses</h2>
        {businesses?.map((b) => (
          <div key={b.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{b.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>{b.address}</div>
          </div>
        ))}
      </aside>
      <div ref={mapContainer} style={{ flex: 1 }} />
    </div>
  );
}
```

- [ ] **Step 8: Create apps/web/src/App.tsx**

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.js";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 9: Create apps/web/src/main.tsx**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: Install deps and check TypeScript compiles (the test for this task)**

```bash
pnpm install
pnpm --filter @bizconnect/web test
```

Expected: `tsc --noEmit` exits 0 with no errors.

- [ ] **Step 11: Commit**

```bash
git add apps/web/
git commit -m "feat: scaffold apps/web React + Mapbox council dashboard"
```

---

## Task 7: apps/whatsapp — webhook service

**Files:**
- Create: `apps/whatsapp/package.json`
- Create: `apps/whatsapp/tsconfig.json`
- Create: `apps/whatsapp/vitest.config.ts`
- Create: `apps/whatsapp/.env.example`
- Create: `apps/whatsapp/src/index.ts`
- Create: `apps/whatsapp/src/webhook.ts`
- Create: `apps/whatsapp/src/client/api.ts`
- Create: `apps/whatsapp/src/__tests__/webhook.test.ts`

- [ ] **Step 1: Write the failing webhook tests**

Create `apps/whatsapp/src/__tests__/webhook.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildServer } from "../index.js";

describe("GET /webhook/whatsapp (Meta verification)", () => {
  it("returns the hub.challenge when verify token matches", async () => {
    process.env.VERIFY_TOKEN = "test-token";
    const server = buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=abc123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("abc123");
  });

  it("returns 403 when verify token does not match", async () => {
    process.env.VERIFY_TOKEN = "test-token";
    const server = buildServer();
    const res = await server.inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123",
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("POST /webhook/whatsapp (incoming message)", () => {
  it("returns 200 for a valid webhook payload", async () => {
    const server = buildServer();
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
});
```

- [ ] **Step 2: Create apps/whatsapp/package.json**

```json
{
  "name": "@bizconnect/whatsapp",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "@bizconnect/shared": "workspace:*",
    "fastify": "^4.26.0",
    "@fastify/sensible": "^5.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  }
}
```

- [ ] **Step 3: Create apps/whatsapp/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create apps/whatsapp/vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
});
```

- [ ] **Step 5: Create apps/whatsapp/.env.example**

```
WHATSAPP_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_webhook_verify_token
API_BASE_URL=http://localhost:3001
PORT=3002
```

- [ ] **Step 6: Create apps/whatsapp/src/webhook.ts**

```typescript
import type { FastifyPluginAsync } from "fastify";

interface VerifyQuery {
  "hub.mode": string;
  "hub.verify_token": string;
  "hub.challenge": string;
}

export const webhookRoute: FastifyPluginAsync = async (fastify) => {
  // Meta calls this GET endpoint to verify the webhook URL
  fastify.get<{ Querystring: VerifyQuery }>("/webhook/whatsapp", async (request, reply) => {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = request.query;
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return reply.code(200).send(challenge);
    }
    return reply.code(403).send("Forbidden");
  });

  // Meta sends incoming messages here
  fastify.post("/webhook/whatsapp", async (request, reply) => {
    const body = request.body as { object: string; entry: unknown[] };
    if (body.object !== "whatsapp_business_account") return reply.code(400).send("Bad request");

    // Process each entry — message routing happens here in future tasks
    for (const _entry of body.entry) {
      // TODO(flows): route message to appropriate flow handler
    }

    return reply.code(200).send("OK");
  });
};
```

- [ ] **Step 7: Create apps/whatsapp/src/client/api.ts**

```typescript
import type { Business, UpdateBusiness, CreateIssue, Issue } from "@bizconnect/shared";

const BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const apiClient = {
  getBusiness: (id: string) => request<Business>(`/businesses/${id}`),
  updateBusiness: (id: string, body: UpdateBusiness) =>
    request<{ success: boolean }>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  createIssue: (body: CreateIssue) =>
    request<{ id: string }>("/issues", { method: "POST", body: JSON.stringify(body) }),
  updateIssueStatus: (id: string, status: Issue["status"]) =>
    request<{ success: boolean }>(`/issues/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};
```

- [ ] **Step 8: Create apps/whatsapp/src/index.ts**

```typescript
import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { webhookRoute } from "./webhook.js";

export function buildServer() {
  const server = Fastify({ logger: process.env.NODE_ENV !== "test" });
  server.register(sensible);
  server.register(webhookRoute);
  return server;
}

const isMain = process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js");
if (isMain) {
  const server = buildServer();
  await server.listen({ port: Number(process.env.PORT ?? 3002), host: "0.0.0.0" });
}
```

- [ ] **Step 9: Install deps and run webhook tests**

```bash
pnpm install
pnpm --filter @bizconnect/whatsapp test
```

Expected: 3 tests PASS.

- [ ] **Step 10: Run all tests across the monorepo**

```bash
pnpm test
```

Expected: all tests across `@bizconnect/shared`, `@bizconnect/api`, and `@bizconnect/whatsapp` pass. `@bizconnect/web` exits 0 (TypeScript clean).

- [ ] **Step 11: Commit**

```bash
git add apps/whatsapp/
git commit -m "feat: scaffold apps/whatsapp webhook service with Meta verification"
```

---

## Task 8: Database migration SQL

The spec defines three tables with PostGIS geography columns. Create the initial migration so developers can spin up a local DB.

**Files:**
- Create: `apps/api/migrations/001_initial.sql`

- [ ] **Step 1: Create apps/api/migrations/001_initial.sql**

```sql
-- Requires: CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE businesses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  address          TEXT NOT NULL,
  location         GEOGRAPHY(POINT, 4326) NOT NULL,
  trading_hours    JSONB,
  services         TEXT[] NOT NULL DEFAULT '{}',
  verified_at      TIMESTAMPTZ,
  last_heartbeat_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX businesses_location_idx ON businesses USING GIST (location);

CREATE TABLE alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  polygon     GEOGRAPHY(POLYGON, 4326) NOT NULL,
  sent_at     TIMESTAMPTZ,
  created_by  UUID REFERENCES businesses(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX alerts_polygon_idx ON alerts USING GIST (polygon);

CREATE TABLE issues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  category    TEXT NOT NULL,
  description TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  location    GEOGRAPHY(POINT, 4326) NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- [ ] **Step 2: Apply migration to local database**

```bash
# Create DB (requires PostgreSQL + PostGIS installed)
createdb bizconnect
psql bizconnect -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql bizconnect -f apps/api/migrations/001_initial.sql
```

Expected: 3 tables created, no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/migrations/
git commit -m "feat: add initial PostGIS database migration"
```

---

## Post-Scaffolding Checklist

After all tasks complete, verify end-to-end by starting all apps in parallel:

```bash
# Terminal 1
pnpm dev
# Starts all three apps via Turborepo:
#   apps/api    → http://localhost:3001
#   apps/web    → http://localhost:5173
#   apps/whatsapp → http://localhost:3002

# Quick smoke test (with DATABASE_URL set)
curl http://localhost:3001/health
# → {"status":"ok"}
```
