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
ARG VITE_API_BASE_URL=/api
ARG VITE_API_REFRESH_PATH=/api/auth/refresh
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_REFRESH_PATH=$VITE_API_REFRESH_PATH

RUN npm run build

# ─── Stage 2: Nginx ───────────────────────────────────────────────────────────
FROM nginx:stable-alpine

# Copy built SPA
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]