-- migrate:up
-- Users table
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--Links table 
CREATE TABLE links (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT NOT NULL UNIQUE,
  original_url   TEXT NOT NULL,
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at     TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

--Click events table

CREATE TABLE click_events(
  id             BIGSERIAL PRIMARY KEY, 
  link_id        UUID REFERENCES links(id) ,
  clicked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referrer       TEXT ,
  user_agent     TEXT ,
  ip_hash        TEXT
);

CREATE INDEX idx_links_code ON links(code);
CREATE INDEX idx_ce_link_id ON click_events(link_id);


-- migrate:down
DROP TABLE click_events;
DROP TABLE links;
DROP TABLE users;
