# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BizConnect Chatswood** is a multi-cultural connectivity platform that bridges Chatswood Council and local businesses via a geospatial "single source of truth." It is currently in the **planning phase** — no code has been written yet.

## Planned Architecture

### Tech Stack
- **Council Dashboard (Web):** React + Mapbox
- **Business Interface (Mobile):** WhatsApp Business API (primary UX for shop owners)
- **Backend:** Node.js + PostGIS (geospatial queries and business data)
- **Intelligence Layer:** LLM-based scrapers for multi-lingual data extraction

### System Components
The platform serves three distinct personas with different interfaces:
1. **Business Owners** interact primarily via WhatsApp — profile management, issue reporting, receiving council alerts
2. **Council Employees** use a React/Mapbox web dashboard — draw map polygons to target alerts, verify data, manage service requests
3. **Community Contributors** use a public-facing map — discovery, crowdsourced edits submitted for council review

### Key Architectural Decisions
- **Spatial Messaging:** The core council-to-business flow uses polygon selection on a Mapbox map to identify businesses (via PostGIS intersection) and trigger targeted WhatsApp messages
- **Data Verification Loop:** All scraped or community-contributed data is queued for council employee validation before becoming authoritative
- **6-Month Data Heartbeat:** Business profile data expires every 6 months; reverification is triggered by lease/council events
- **Multi-lingual Support:** LLM scrapers extract and translate business info (names, services, hours) from multi-language sources

## Source Documentation

- `PROBLEM_STATEMENT.md` — problem context, challenge requirements, and personas
- `PROJECT_CONCEPT.md` — tech stack decisions and core feature definitions
- `USE_CASES.md` — detailed flows for all three personas (Business Owner, Council Employee, Community Contributor)
