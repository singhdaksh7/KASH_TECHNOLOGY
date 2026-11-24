# Runtime image for the KASH website + CMS (linux/amd64).
# The Next.js build output (.next) is produced by scripts/build-release.sh BEFORE this image is built
# (JS output is platform independent); native dependencies (Prisma engine, sharp) are installed here for the target platform.
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 MEDIA_DIR=/data/media PORT=3000 HOSTNAME=0.0.0.0
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY prisma ./prisma
RUN npx prisma generate
COPY next.config.ts ./
COPY public ./public
COPY .next ./.next
COPY dist ./dist
COPY deploy/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /data/media && chown -R node:node /data /app/.next
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD curl -fsS http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
ENTRYPOINT ["/entrypoint.sh"]
