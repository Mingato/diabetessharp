# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json* ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY client ./client
COPY server ./server
COPY shared ./shared

# Build (shared → client → server)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json* ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/client-dist ./server/client-dist
COPY --from=builder /app/shared/dist ./shared/dist

# Railway sets PORT automatically
EXPOSE 8080

CMD ["npm", "run", "start"]
