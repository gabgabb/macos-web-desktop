# -------------------
# deps
# -------------------
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN corepack enable && \
    corepack prepare yarn@4.11.0 --activate && \
    yarn install --immutable

# -------------------
# build
# -------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app ./
COPY . .

RUN corepack enable && corepack prepare yarn@4.11.0 --activate && yarn build

# -------------------
# runner (prod)
# -------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && \
    corepack prepare yarn@4.11.0 --activate \

EXPOSE 6000

# Standalone (si activé) sinon garde classique
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start", "-p", "6000"]
