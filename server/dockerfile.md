FROM oven/bun:1.3.9-alpine AS base
WORKDIR /usr/src/app

# === Dependencies Stage ===
FROM base AS dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# === Prisma Stage ===
FROM dependencies AS prisma
ARG POSTGRES_URL="postgresql://dummy:dummy@postgres:5432/dummy"

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN POSTGRES_URL=${POSTGRES_URL} bun run prisma:generate

# === Development Stage ===
FROM prisma  AS development
COPY --chown=bun:bun . .
USER bun

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "start" ]
