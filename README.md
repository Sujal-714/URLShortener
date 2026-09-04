# URL Shortener

A backend project built to apply core backend engineering concepts from first principles: authentication, request middleware, Redis caching, rate limiting, background job processing, and fault-tolerant design — each tied to a real, working feature rather than a toy demo.

## Features

- **User authentication** — signup/login with hashed passwords and JWT-based sessions
- **Link shortening** — create short links, optionally tied to a user account (anonymous shortening is also supported)
- **Fast redirects with Redis caching** — the hot path (`GET /:code`) checks Redis before Postgres, with a graceful fallback to Postgres if Redis is unreachable
- **Tiered rate limiting** — stricter limits on anonymous link creation, looser limits for authenticated users and redirects, backed by Redis via `rate-limit-redis`
- **Click analytics via background jobs** — every redirect enqueues a click event (referrer, user agent, hashed IP) to a BullMQ queue, processed asynchronously by a separate worker process so the redirect itself is never slowed down by analytics writes
- **Aggregated stats endpoint** — total clicks, clicks in the last 7/30 days, top referrers, and a daily click breakdown, scoped to the link's owner

## Tech stack

- **Runtime:** Node.js, TypeScript, Express
- **Database:** PostgreSQL, with migrations managed by [dbmate](https://github.com/amacneil/dbmate)
- **Cache:** Redis (via `node-redis`)
- **Queue:** BullMQ, using its `node-redis` adapter (no `ioredis` dependency)
- **Auth:** JWT
- **Rate limiting:** `express-rate-limit` + `rate-limit-redis`

## Architecture

```
Client → API server (auth, rate limit) → Redis cache → PostgreSQL
                                              ↓
                                        Job queue → Worker → PostgreSQL (click_events)
```

Reads (redirects) go through a cache-then-database path: a cache hit skips Postgres entirely; a cache miss falls through to Postgres and repopulates the cache. Writes to click analytics are pushed onto a queue instead of blocking the redirect response, and processed by an independent worker process — if the worker is down, jobs simply wait in Redis until it's back up, and the redirect itself is unaffected either way.

If Redis is unreachable, the app degrades gracefully rather than failing: redirects fall back to querying Postgres directly, and cache writes fail silently without breaking the response.

## Database schema

- **`users`** — id, email, password_hash, created_at
- **`links`** — id, code (unique short code), original_url, user_id (nullable — anonymous links allowed), created_at, expires_at
- **`click_events`** — id, link_id, clicked_at, referrer, user_agent, ip_hash (IP is hashed, never stored raw)

## Setup

### Prerequisites

- Node.js
- PostgreSQL running locally
- Redis running locally (Redis Stack via Docker recommended, for the included RedisInsight GUI)

### Install

```bash
cd server
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your actual values:

```
DATABASE_URL="postgres://user:password@127.0.0.1:5432/url_shortener?sslmode=disable"
REDIS_URL="redis://127.0.0.1:6379"
PORT=3000
```

### Run Redis (Docker)

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

RedisInsight (a GUI for browsing cache/queue contents) will be available at `http://localhost:8001`.

### Run migrations

```bash
npx dbmate up
```

### Start the app

Two processes need to run simultaneously, in separate terminals:

```bash
npm run dev      # the API server
npm run worker   # the background worker that processes click events
```

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/signup` | No | Create an account |
| POST | `/users/login` | No | Log in, receive a JWT |
| POST | `/links` | Optional | Create a short link (higher rate limit if authenticated) |
| DELETE | `/links/:id` | Yes | Delete a link you own (invalidates its cache entry) |
| GET | `/:code` | No | Redirect to the original URL; records a click event |
| GET | `/links/:id/stats` | Yes | Aggregated click analytics for a link you own |

## What's next

Structured request logging, a real `/health` endpoint reporting the status of Postgres/Redis/the queue, and metrics exposed via Prometheus/Grafana — the observability layer, as distinct from the analytics already built above.