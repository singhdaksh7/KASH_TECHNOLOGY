# Deploying KASH (Illure VPS)
1. `scripts/build-release.sh` then `docker buildx build --platform linux/amd64 -f release/deploy/Dockerfile -t kash-web:<tag> release` and ship the image (`docker save | ssh host docker load`).
2. Server layout: `/opt/kash/{docker-compose.yml,docker-compose.domain.yml,.env(KASH_IMAGE),secrets/kash.env (600),backups/}`.
3. `docker compose --env-file .env --env-file secrets/kash.env up -d` (migrations + idempotent seed run in the entrypoint).
4. After DNS A records for `@` and `www` point at the server: add `-f docker-compose.domain.yml`.
5. Rollback: set `KASH_IMAGE` in `.env` to the previous tag and `up -d web`; the database is forward-compatible (additive migrations only). Restore data with `pg_restore` from `backups/`.
Secrets (DB password, AUTH_SECRET, TOTP key, bootstrap admin) live only in `secrets/`; never commit them.
