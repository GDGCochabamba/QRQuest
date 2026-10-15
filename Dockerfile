# syntax=docker/dockerfile:1

# ---- Build: Vite bundles the static app ----
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec vite build

# ---- Serve: nginx on the port Cloud Run provides ----
FROM nginx:alpine
# nginx's entrypoint runs envsubst on this template, filling in $PORT
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=8080
EXPOSE 8080
