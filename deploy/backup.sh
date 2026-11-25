#!/bin/sh
# Nightly KASH database backup (custom-format pg_dump), verified, 14-day retention of nightly files only.
set -eu
DIR=/opt/kash/backups
TS=$(date -u +%Y%m%dT%H%M%SZ)
F="$DIR/kash-db-nightly-$TS.dump"
umask 077
docker exec kash-postgres pg_dump -U kash -d kash -Fc > "$F"
[ -s "$F" ] || { echo "$TS BACKUP FAILED: empty file"; rm -f "$F"; exit 1; }
N=$(docker exec -i kash-postgres pg_restore --list < "$F" | wc -l)
[ "$N" -gt 50 ] || { echo "$TS BACKUP SUSPECT: only $N TOC entries ($F kept for inspection)"; exit 1; }
find "$DIR" -name "kash-db-nightly-*.dump" -mtime +14 -delete
echo "$TS OK $(basename "$F") $(wc -c < "$F") bytes, $N restorable entries"
