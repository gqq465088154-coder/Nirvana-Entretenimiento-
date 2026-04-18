FROM node:20-alpine AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM deps AS web-builder
WORKDIR /workspace
COPY . .
RUN npm run build:web

FROM deps AS backend-runner
WORKDIR /workspace
ENV NODE_ENV=production
COPY backend ./backend
COPY package.json package-lock.json ./
EXPOSE 4000
CMD ["node", "backend/src/server.js"]

FROM node:20-alpine AS web-runner
WORKDIR /workspace
ENV NODE_ENV=production
COPY --from=web-builder /workspace/apps/web/.next/standalone ./
COPY --from=web-builder /workspace/apps/web/.next/static ./apps/web/.next/static
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
