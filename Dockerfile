# ═══════════════════════════════════════════════════════════════════════════════
# Directioner — Multi-stage Docker Build
# ═══════════════════════════════════════════════════════════════════════════════
# Stage 1: deps  — install all workspace dependencies
# Stage 2: build — compile frontend (Vite) + API server (esbuild)
# Stage 3: api   — minimal Node runtime for the API server
# Stage 4: web   — Nginx serving the static Vite build
#
# Build:
#   docker build --target api -t directioner-api .
#   docker build --target web -t directioner-web .
#
# Or use docker-compose (recommended):
#   docker compose up --build
# ═══════════════════════════════════════════════════════════════════════════════

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM base AS deps
# Copy workspace manifests first (better layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY lib/db/package.json                  lib/db/
COPY lib/api-zod/package.json             lib/api-zod/
COPY lib/api-client-react/package.json    lib/api-client-react/
COPY lib/api-spec/package.json            lib/api-spec/
COPY artifacts/api-server/package.json    artifacts/api-server/
COPY artifacts/directioner/package.json   artifacts/directioner/
RUN pnpm install --frozen-lockfile --prod=false

# ── Stage 2: Build everything ──────────────────────────────────────────────────
FROM deps AS builder
# Copy all source
COPY . .
# Build frontend (Vite static output → artifacts/directioner/dist/)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID \
    VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @workspace/directioner run build
# Build API server (esbuild output → artifacts/api-server/dist/)
RUN pnpm --filter @workspace/api-server  run build

# ── Stage 3: API Server runtime ────────────────────────────────────────────────
FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
# Copy compiled bundle and production deps
COPY --from=builder /app/artifacts/api-server/dist ./dist
COPY --from=builder /app/artifacts/api-server/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/healthz || exit 1
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]

# ── Stage 4: Frontend (Nginx) ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS web
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom config (SPA routing + API proxy)
COPY docker/nginx.conf /etc/nginx/conf.d/directioner.conf
# Copy compiled Vite output
COPY --from=builder /app/artifacts/directioner/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
