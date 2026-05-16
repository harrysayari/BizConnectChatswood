# Web App Scaffolding Design

**Date:** 2026-05-16
**Project:** BizConnect Chatswood
**Status:** Approved

## Overview

Full-stack TypeScript monorepo using Turborepo + pnpm workspaces. Three apps (web dashboard, REST API, WhatsApp bot service) sharing a common types package. No code exists yet — this is the initial scaffolding.

## Monorepo Structure

```
BizConnectChatswood/
├── apps/
│   ├── web/          # Council Dashboard
│   ├── api/          # REST API + PostGIS backend
│   └── whatsapp/     # WhatsApp webhook service
├── packages/
│   └── shared/       # Zod schemas + TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

**Tooling:**
- Turborepo for build orchestration and caching
- pnpm workspaces for dependency management and linking
- `tsconfig.base.json` at root; each app extends it

## Apps

### apps/web — Council Dashboard

- **Vite** (dev server + build)
- **React 18** + React Router v6
- **Mapbox GL JS** for the geospatial map
- **TanStack Query** for server state / data fetching
- Internal structure: `src/pages/`, `src/components/`, `src/hooks/`, `src/lib/`

### apps/api — REST API

- **Fastify** HTTP server (TypeScript-native, plugin ecosystem)
- **postgres.js** for raw SQL — PostGIS queries are too spatial for ORMs to handle cleanly
- **Zod** for request/response validation (schemas imported from `packages/shared`)
- Internal structure: `src/routes/`, `src/db/`, `src/plugins/`

### apps/whatsapp — WhatsApp Bot Service

- **Fastify** to receive Meta Cloud API webhooks
- **State machine** per conversation to track where a business owner is in the bot flow (e.g., onboarding vs. issue reporting)
- Never touches the database directly — calls `apps/api` as an internal HTTP client
- Internal structure: `src/webhook.ts`, `src/flows/`, `src/client/` (api client)

## packages/shared

Single source of truth for data shapes shared across all apps. Uses Zod to define schemas and exports both the schema and the inferred TypeScript type.

**Core entities:**
- `Business` — id, name, phone, address, location (GeoJSON Point), trading_hours, services[], verified_at, last_heartbeat_at
- `Alert` — id, title, body, polygon (GeoJSON Polygon), sent_at, created_by
- `Issue` — id, business_id, category, description, status, location (GeoJSON Point), resolved_at

## API Routes (apps/api)

```
GET  /businesses          — list + filter businesses
GET  /businesses/:id      — single business profile
PUT  /businesses/:id      — update profile (called by WhatsApp service)

POST /alerts              — create alert with GeoJSON polygon
POST /alerts/:id/send     — ST_Within query → trigger WhatsApp sends to matched businesses

POST /issues              — business submits a street issue report
PUT  /issues/:id/status   — council updates ticket status

POST /webhook/whatsapp    — Meta Cloud API webhook entry point (apps/whatsapp only)
```

## Database Schema

PostgreSQL + PostGIS. Uses `GEOGRAPHY` type (not `GEOMETRY`) for accurate meter-based distance calculations.

```sql
-- businesses
id UUID PK, name TEXT, phone TEXT,
location GEOGRAPHY(POINT, 4326),
address TEXT, trading_hours JSONB, services TEXT[],
verified_at TIMESTAMPTZ, last_heartbeat_at TIMESTAMPTZ

-- alerts
id UUID PK, title TEXT, body TEXT,
polygon GEOGRAPHY(POLYGON, 4326),
sent_at TIMESTAMPTZ, created_by UUID

-- issues
id UUID PK, business_id UUID FK,
category TEXT, description TEXT, status TEXT,
location GEOGRAPHY(POINT, 4326),
resolved_at TIMESTAMPTZ
```

**Key spatial query pattern** (alert targeting):
```sql
SELECT * FROM businesses
WHERE ST_Within(location::geometry, ST_GeomFromGeoJSON($1)::geometry);
```

## Data Flow

1. **Council sends alert:** Web draws polygon → `POST /alerts` → `POST /alerts/:id/send` → ST_Within query finds matched businesses → API calls Meta Cloud API to send WhatsApp messages
2. **Business owner updates profile:** Owner texts bot → WhatsApp service parses intent → `PUT /businesses/:id` on API → DB updated
3. **Business owner reports issue:** Owner texts bot → WhatsApp service → `POST /issues` on API → Council sees ticket in dashboard

## Environment Variables

Each app has its own `.env`. Root `.env.example` documents all required vars:

- `apps/api`: `DATABASE_URL`, `WHATSAPP_API_URL` (internal), `PORT`
- `apps/whatsapp`: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `VERIFY_TOKEN`, `API_BASE_URL`, `PORT`
- `apps/web`: `VITE_API_BASE_URL`, `VITE_MAPBOX_TOKEN`
