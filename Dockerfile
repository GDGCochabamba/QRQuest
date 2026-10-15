# syntax=docker/dockerfile:1

# ---- Build: Vite bundles the static app ----
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Lifecycle scripts are not needed to bundle a web app (also avoids pnpm's ignored-builds error)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Vite inlines VITE_* values at build time, so pass them as build args:
#   docker build --build-arg VITE_FIREBASE_API_KEY=... -t qrquest .
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

COPY . .
RUN pnpm exec vite build

# ---- Serve: nginx on the port Cloud Run provides ----
FROM nginx:alpine
# nginx's entrypoint runs envsubst on this template, filling in $PORT
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=8080
EXPOSE 8080
