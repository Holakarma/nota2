# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema & generated client (needed at runtime)
COPY --from=builder /app/src/core/prisma/generated ./src/core/prisma/generated
COPY --from=builder /app/prisma ./prisma

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]