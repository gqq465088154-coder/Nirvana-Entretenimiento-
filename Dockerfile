# ── stage 1: install all workspace dependencies ──────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

# ── stage 2: build the Next.js web app ────────────────────────────────────────
FROM node:20-alpine AS web-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm --workspace apps/web run build

# ── stage 3: lean backend image ───────────────────────────────────────────────
FROM node:20-alpine AS backend-runner
WORKDIR /app
ENV NODE_ENV=production
# Workspace node_modules live at the root
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY backend ./backend
EXPOSE 4000
CMD ["node", "backend/src/server.js"]

# ── stage 4: lean web image ───────────────────────────────────────────────────
FROM node:20-alpine AS web-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Root workspace manifest – required so `npm --workspace` resolves correctly
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
# Hoisted node_modules
COPY --from=deps /app/node_modules ./node_modules
# Next.js built output (no source needed for `next start`)
COPY --from=web-builder /app/apps/web/.next ./apps/web/.next
# Runtime config (poweredByHeader, env vars, etc.)
COPY apps/web/next.config.mjs ./apps/web/next.config.mjs
# Static public assets
COPY apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["npm", "--workspace", "apps/web", "run", "start"]
