#!/bin/sh
# Calls KASH CMS scheduled publishing (publish due content, expire unpublish dates). Safe to run repeatedly: the endpoint is idempotent.
# The secret is read from a root-only file and passed to curl on stdin, never on a command line.
set -eu
SECRET=$(sed -n "s/^CMS_SCHEDULER_SECRET=//p" /opt/kash/secrets/scheduler.env)
[ -n "$SECRET" ] || { echo "$(date -u +%FT%TZ) scheduler secret missing"; exit 1; }
OUT=$(printf "Authorization: Bearer %s\n" "$SECRET" | docker exec -i kash-web curl -fsS -m 30 -X POST -H @- http://127.0.0.1:3000/api/internal/scheduler/content) || { echo "$(date -u +%FT%TZ) scheduler call failed"; exit 1; }
# Log only when something happened (or failed), to keep the log small.
case "$OUT" in *\"published\":\[\],\"unpublished\":\[\],\"failed\":\[\]*) : ;; *) echo "$(date -u +%FT%TZ) $OUT" ;; esac
