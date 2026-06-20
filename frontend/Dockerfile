# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build Vite app
# VITE_API_BASE_URL is injected at build time via --build-arg

RUN npm run build

# ─── Stage 2: Nginx ───────────────────────────────────────────────────────────
FROM nginx:stable-alpine

# Copy built SPA
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]