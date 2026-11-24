#!/usr/bin/env bash
# Builds a release bundle in ./release (Docker build context) without needing production secrets or a database.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf release .next
npx prisma generate >/dev/null
env -u DATABASE_URL NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://kash-technology.com}" npm run build
npx esbuild prisma/seed.ts --bundle --platform=node --target=node22 --outfile=dist/seed.cjs --external:@prisma/client --external:bcryptjs --log-level=warning
mkdir -p release/deploy
cp -R package.json package-lock.json prisma public next.config.ts dist release/
rsync -a --exclude cache .next release/
cp deploy/Dockerfile deploy/entrypoint.sh release/deploy/
echo "release bundle ready in ./release"
