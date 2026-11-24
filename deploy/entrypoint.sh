#!/bin/sh
set -e
# Apply pending migrations (never `migrate dev` in production), then seed idempotently, then start.
echo "[kash] applying database migrations"
npx prisma migrate deploy
if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "[kash] seeding roles/permissions/content (create-if-missing)"
  node dist/seed.cjs
fi
echo "[kash] starting web server"
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
