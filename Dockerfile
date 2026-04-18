FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM node:20-alpine AS web-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace apps/web run build

FROM node:20-alpine AS backend-runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY backend ./backend
EXPOSE 4000
CMD ["node", "backend/src/server.js"]

FROM node:20-alpine AS web-runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web ./apps/web
COPY --from=web-builder /app/apps/web/.next ./apps/web/.next
EXPOSE 3000
CMD ["npm", "--workspace", "apps/web", "run", "start"]
