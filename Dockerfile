# Multi-stage build para produção (padrão hws-application-example)
# Variáveis de ambiente (HWS_AUTH_URL, etc.) são injetadas em RUNTIME pelo Railway
# — não são necessárias no build. O server injeta no HTML ao servir.

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# Stage 2: Dependencies (produção)
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 3: Build (client Vite + server TypeScript)
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
# Build sem env vars — a injeção de HWS_AUTH_URL acontece em runtime no server
RUN npm run build

# Stage 4: Produção
FROM base AS production
ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3002) + '/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server/index.js"]
