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
