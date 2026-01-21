# -------------------
# deps
# -------------------
FROM node:22-alpine AS deps
WORKDIR /app

ARG NEXT_PUBLIC_LOCK_PASSWORD
ENV NEXT_PUBLIC_LOCK_PASSWORD=$NEXT_PUBLIC_LOCK_PASSWORD

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

ARG NEXT_PUBLIC_LOCK_PASSWORD
ENV NEXT_PUBLIC_LOCK_PASSWORD=$NEXT_PUBLIC_LOCK_PASSWORD

COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY src ./src
COPY public ./public

COPY next.config.ts ./next.config.ts
COPY tsconfig.json ./tsconfig.json
COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

RUN corepack enable && corepack prepare yarn@4.11.0 --activate && yarn build

# -------------------
# runner (prod)
# -------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && \
    corepack prepare yarn@4.11.0 --activate

EXPOSE 8000

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Standalone (si activé) sinon garde classique
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start", "-p", "8000"]
