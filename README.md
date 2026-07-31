# Rastaa Cabs

A taxi/car-rental booking site inspired by the layout of MakeMyTrip's city
cab pages: hero search widget, trip-type tabs, a fleet of cab types with
transparent per-km pricing, popular routes, trust badges and an FAQ.

## Architecture

```
frontend/       Next.js (React) — the website itself
backend-node/   Node.js + Express — API gateway, search, bookings (MongoDB)
backend-java/   Java + Spring Boot — the fare calculation engine
```

Request flow for a fare estimate:

```
Browser → Next.js (SearchWidget) → Node API (/api/fare/estimate)
                                         → Java fare-engine (/api/fare/calculate)
```

Node.js owns the gateway, route/city search, cab-type data and the
bookings store, all backed by MongoDB. Java owns the actual pricing rules —
base fare, per-km rate, and multipliers for round trips vs. local/hourly
packages — in `FareService.java`. If the Java service is unreachable, Node
falls back to a simplified local calculation so the booking flow doesn't break.

## Running it locally

You'll need Node.js 18+, Java 17 + Maven, and Docker (for MongoDB).


**1. MongoDB** (port 27017, plus an admin UI on 8081)

```bash
docker compose up -d
cd backend-node && cp .env.example .env
npm install && npm run seed   # populates cab types + sample routes
```

**2. Java fare engine** (port 8080)

```bash
cd backend-java
mvn spring-boot:run
```

**3. Node API gateway** (port 4000)

```bash
cd backend-node
npm run dev
```

**4. Next.js frontend** (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The frontend proxies `/api/*` calls to the
Node backend (configured in `frontend/next.config.js` via
`NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:4000`).

## API summary

**Node gateway** (`backend-node`)
- `GET  /api/cabtypes` — fleet with base fare / included km / per-km rate (cached 60s)
- `GET  /api/cities` — supported pickup/drop cities
- `GET  /api/routes/search?q=&page=&limit=` — text-indexed route/city search, rate-limited
- `GET  /api/routes/:from/:to` — exact-match route lookup
- `POST /api/fare/estimate` — `{ cabTypeId, distanceKm, tripType }` → forwards to Java, falls back locally
- `POST /api/bookings` — create a booking, rate-limited
- `GET  /api/bookings?status=&page=&limit=` / `GET /api/bookings/:id` — always paginated

**Java fare engine** (`backend-java`)
- `POST /api/fare/calculate` — `{ cabTypeId, distanceKm, tripType }` → `{ total, baseFare, extraKmCharge, ... }`

## Scaling search and booking traffic

The data layer is MongoDB (via Mongoose), chosen because both hot paths —
route/city search and booking writes — are simple document lookups, not
multi-table joins, and traffic on the two paths grows differently:

- **Search is read-heavy and bursty.** `Route` has a text index on
  `from`/`to` so lookups use an inverted index instead of scanning +
  regexing every document, plus a compound `{from, to}` index for exact
  matches. Reads are issued with `.read("secondaryPreferred")` so they land
  on replica-set secondaries instead of competing with booking writes on
  the primary — the `docker-compose.yml` here runs a single-node replica
  set locally so that read preference actually takes effect the same way
  it will in production. `/api/cabtypes` (hit on every page load, changes
  rarely) sits behind a 60-second in-process cache; move that to Redis once
  you run more than one Node instance so the cache is shared.
- **Bookings are write-heavy and must not be lost.** `Booking` has indexes
  on `{from, to, date}` (route/date lookups) and `{status, createdAt}`
  (dispatch queues, newest first) — write throughput on a single primary is
  usually fine well past this app's likely scale; shard only if profiling
  actually shows the primary as the bottleneck, using a hashed shard key
  (`_id`) so writes spread evenly instead of hotspotting on one date range.
- **Both list endpoints are paginated** (`page`/`limit`, capped) rather
  than returning full collections — the most common way a "just list
  everything" endpoint falls over is exactly that query with no bound as
  the table grows.
- **Rate limits are split by endpoint**, not applied globally — search
  (bursty, sometimes automated) and booking creation (lower volume, higher
  value) have different limits so a spike in one can't starve the other.
- **Connection pooling** (`maxPoolSize`) is set per Node instance in
  `db/connect.js` — if you run several Node instances behind a load
  balancer, keep total pool usage across all of them under MongoDB's own
  connection ceiling.

## Notes / next steps

This is a working starter, not a production system. Things you'd still want
before shipping: auth for drivers/riders, payment integration, a real
distance/duration lookup (e.g. a maps API) instead of the manual "distance"
input, a shared cache (Redis) once you're running multiple Node instances,
and wiring the frontend's route table to `/api/routes/search` instead of
its static list.
