FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/backend/prisma ./packages/backend/prisma/
RUN npm ci
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared
WORKDIR /app/packages/backend
RUN npx prisma generate
RUN npm run build
ARG NODE_ENV=production

FROM node:20-alpine AS runner
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/backend/prisma ./packages/backend/prisma/
COPY packages/backend/prisma.config.ts ./packages/backend
RUN npm ci --workspace=backend --omit=dev
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

WORKDIR /app/packages/backend
RUN npx prisma generate
EXPOSE 8001
CMD ["npm", "run", "start"]
