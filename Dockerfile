# -------------------
# deps
# -------------------
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.11.0 --activate

RUN yarn -v

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

# -------------------
# build
# -------------------
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.11.0 --activate

COPY --from=deps /app ./
COPY . .

RUN yarn build

# -------------------
# runner (prod)
# -------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 6000

# Standalone (si activé) sinon garde classique
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start", "-p", "6000"]
