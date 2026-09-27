# Docs analytics dashboard

A small Next.js app for reviewing what readers do on the docs site: page 👍/👎, AI chats and their 👍/👎, and search-bar queries, including those that found nothing.

**Where the data comes from:** the docs site forwards events to the Fossorial API (`/api/v1/docs-analytics`), which stores them in its Postgres (`docs*` tables, migrations in the api repo). This app reads those tables directly with Drizzle and never writes.

**Retention:** the API deletes docs analytics older than 90 days (`src/controllers/docsAnalytics/retention.ts` in the api repo), so the dashboard's longest range is 90 days (`RETENTION_DAYS` in `src/lib/range.ts`). Change both together.

## Run it

```bash
cd analytics-dashboard
npm install
cp .env.example .env.local   # set DATABASE_URL to the API's Postgres
npm run dev                  # http://127.0.0.1:3005
```

- Point `DATABASE_URL` at the same database the API uses (for local development, the api repo's `docker-compose.postgres.yml`). A read-only role is enough; `.env.example` has the grants.
- `DOCS_SITE_URL` is where page links go (defaults to https://docs.pangolin.net).
- There is **no login**. The dev server only listens on 127.0.0.1. Add auth before deploying it anywhere.