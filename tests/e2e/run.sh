#!/usr/bin/env bash
# End-to-end suite: fresh Postgres per phase → migrate → seed → production server → tests.
# Requires Docker (postgres image) and a prior `npm run build`. Usage: tests/e2e/run.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
PORT=3200
PW='E2E-Passw0rd!-not-a-real-secret'
export TOTP_ENCRYPTION_KEY=e2e-totp-key-not-secret AUTH_SECRET=e2e-auth-secret-not-secret NEXT_PUBLIC_SITE_URL=http://localhost:$PORT MEDIA_DIR=/tmp/kash-e2e-media
export DATABASE_URL="postgresql://postgres:testpw@localhost:54329/kash_e2e?schema=public"
export E2E_TEMP_PASSWORD=1234567890 E2E_ADMIN_EMAIL=e2e-admin@example.test E2E_ADMIN_PASSWORD="$PW"

phase() { # name, require2fa, script
  echo "=== $1"
  docker rm -f kash-e2e-pg >/dev/null 2>&1 || true
  docker run -d --name kash-e2e-pg -e POSTGRES_PASSWORD=testpw -e POSTGRES_DB=kash_e2e -p 54329:5432 postgres:16-alpine >/dev/null
  until docker exec kash-e2e-pg pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done; sleep 2
  rm -rf "$MEDIA_DIR"
  npx prisma migrate deploy >/dev/null
  BOOTSTRAP_ADMIN_EMAIL=$E2E_ADMIN_EMAIL BOOTSTRAP_ADMIN_PASSWORD=$PW npx tsx prisma/seed.ts >/dev/null
  if [ -n "${4:-}" ]; then eval "$4"; fi
  ADMIN_REQUIRE_2FA=$2 npx next start -p $PORT >/tmp/kash-e2e-server.log 2>&1 &
  SERVER=$!
  sleep 5
  set +e; node "tests/e2e/$3"; RC=$?; set -e
  kill $SERVER 2>/dev/null || true; pkill -f "next start -p $PORT" 2>/dev/null || true
  docker rm -f kash-e2e-pg >/dev/null 2>&1 || true
  return $RC
}
FAILED=0
run_phase() { phase "$@" || { echo "!! phase failed: $1"; FAILED=1; }; }
run_phase "AUTH (2FA enforced)" true auth.mjs
run_phase "CMS / RBAC / forms / media" false cms.mjs
run_phase "EMAIL / RESEND (settings, secrecy, contact form, logs)" false email.mjs
run_phase "FOUNDER BOOTSTRAP (temp password → forced change → 2FA)" true founder-bootstrap.mjs \
  'printf %s "$E2E_TEMP_PASSWORD" | USER_EMAIL=$E2E_ADMIN_EMAIL MODE=reset node deploy/ops/force-password-reset.cjs >/dev/null'
exit $FAILED
