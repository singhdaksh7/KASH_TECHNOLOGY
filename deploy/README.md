# Deploying KASH (Illure VPS)
1. `scripts/build-release.sh` then `docker buildx build --platform linux/amd64 -f release/deploy/Dockerfile -t kash-web:<tag> release` and ship the image (`docker save | ssh host docker load`).
2. Server layout: `/opt/kash/{docker-compose.yml,docker-compose.domain.yml,.env(KASH_IMAGE),secrets/kash.env (600),backups/}`.
3. `docker compose --env-file .env --env-file secrets/kash.env up -d` (migrations + idempotent seed run in the entrypoint).
4. After DNS A records for `@` and `www` point at the server: add `-f docker-compose.domain.yml`.
5. Rollback: set `KASH_IMAGE` in `.env` to the previous tag and `up -d web`; the database is forward-compatible (additive migrations only). Restore data with `pg_restore` from `backups/`.
Secrets (DB password, AUTH_SECRET, TOTP key, bootstrap admin) live only in `secrets/`; never commit them.

## v2.1.0 (CMS Phase 2) operations
- **Scheduler secret:** `printf 'CMS_SCHEDULER_SECRET=%s\n' "$(openssl rand -hex 32)" > /opt/kash/secrets/scheduler.env && chmod 600 /opt/kash/secrets/scheduler.env` (compose loads it as an optional env file). Without it `POST /api/internal/scheduler/content` returns 404.
- **Scheduler cron:** copy `deploy/scheduler-tick.sh` to `/opt/kash/`, `deploy/cron/kash-scheduler` to `/etc/cron.d/`. Runs every minute, idempotent, calls the endpoint through `docker exec` (the endpoint is not exposed to the internet by the cron), secret passed on stdin. Log: `/opt/kash/logs/scheduler.log` (only non-empty runs and failures).
- **Nightly backup:** copy `deploy/backup.sh` to `/opt/kash/`, `deploy/cron/kash-backup` to `/etc/cron.d/` (02:30 server time = UTC). Verified custom-format `pg_dump`, 14-day retention of `kash-db-nightly-*.dump` only. Log: `/opt/kash/backups/backup.log`. Media files (volume `kash_media`) are NOT included.
- **Deploy command (with domain routing):** `docker compose -f docker-compose.yml -f docker-compose.domain.yml --env-file .env --env-file secrets/kash.env up -d web`
- **Rollback to v2.0.0:** `cd /opt/kash && sed -i 's#^KASH_IMAGE=.*#KASH_IMAGE=kash-web:2.0.0-5a38ed9#' .env && docker compose -f docker-compose.yml -f docker-compose.domain.yml --env-file .env --env-file secrets/kash.env up -d web`. The Phase 2 migration is additive (new tables/nullable columns/enum values), so v2.0.0 runs against the migrated database unchanged. Do NOT restore a database dump unless data is lost; if you must, use `pg_restore --clean` from `/opt/kash/backups/kash-db-pre-v2.1.0-*.dump` (this discards anything written since).

## v2.2.0 (Email & Resend)
- Configure in **Admin → Settings → Email & Resend**: API key (encrypted with `TOTP_ENCRYPTION_KEY`, write-only), From, internal recipient, toggles, **Send Test Email**. Delivery log: `/admin/settings/email/logs`.
- Priority: admin settings → env fallback (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_RECEIVER_EMAIL`) → disabled. Leads are always saved first; email failures never lose a lead.
- Migration `20261127000000_email_delivery` is additive (2 tables, enum, nullable `Lead.budget`). Rolling back the image to 2.1.1 is safe.
- Do NOT change `TOTP_ENCRYPTION_KEY` without re-entering the Resend key in admin (it also protects 2FA secrets).
