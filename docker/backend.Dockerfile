FROM node:20-alpine AS base

# Install pnpm in base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

# Copy package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema and generate client
COPY backend/prisma ./prisma
RUN pnpm prisma generate

# Copy the rest of the application and build
COPY backend .
RUN pnpm build

FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# Copy only necessary files from builder
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app/prisma /app/prisma

# Switch to non-root user
USER hono

# Expose the backend port
EXPOSE 3003

# Start the application
CMD ["pnpm", "start"]
