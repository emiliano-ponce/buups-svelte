# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
# No secrets are needed at build time: all private env vars are read at runtime
# via $env/dynamic/private.
RUN npm run build

# ---- Production dependencies ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
# --ignore-scripts skips the "prepare" (svelte-kit sync) hook, which needs dev deps.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ---- Runtime stage ----
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/build ./build
COPY --chown=node:node package.json ./

USER node
EXPOSE 3000
CMD ["node", "build"]
