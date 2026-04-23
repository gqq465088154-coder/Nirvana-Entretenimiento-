# ── stage 1: install ALL workspace dependencies (build-time only) ────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

# ── stage 2: production-only backend dependencies ────────────────────────────
FROM node:20-alpine AS backend-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci --omit=dev --workspace backend

# ── stage 3: build the Next.js web app ───────────────────────────────────────
FROM node:20-alpine AS web-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm --workspace apps/web run build

# ── stage 4: lean backend runtime image ──────────────────────────────────────
FROM node:20-alpine AS backend-runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only production deps (no devDependencies, no web app deps)
COPY --from=backend-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node backend ./backend
# Ensure the logger's output directory is writable by the non-root user
RUN mkdir -p /app/logs && chown node:node /app/logs
USER node
EXPOSE 4000
CMD ["node", "backend/src/server.js"]

# ── stage 5: lean web runtime image ──────────────────────────────────────────
FROM node:20-alpine AS web-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Root workspace manifest – required so `npm --workspace` resolves correctly
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node apps/web/package.json ./apps/web/package.json
# Hoisted node_modules (full set required by Next.js runtime)
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
# Next.js built output (no source needed for `next start`)
COPY --from=web-builder --chown=node:node /app/apps/web/.next ./apps/web/.next
# Runtime config (poweredByHeader, env vars, etc.)
COPY --chown=node:node apps/web/next.config.mjs ./apps/web/next.config.mjs
# Static public assets
COPY --chown=node:node apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["npm", "--workspace", "apps/web", "run", "start"]
