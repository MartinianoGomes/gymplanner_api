# -------------------------
# BUILD
# -------------------------
FROM node:22 AS build
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build


# -------------------------
# RUNNER (produção)
# -------------------------
FROM node:22-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/swagger.yaml ./swagger.yaml

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/server.js"]
