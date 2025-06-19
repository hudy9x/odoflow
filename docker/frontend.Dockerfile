FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Required for Next.js builds
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm in builder stage
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY frontend .
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1
# ARG NEXT_PUBLIC_API_URL
# ARG NEXT_PUBLIC_WEBSOCKET_URL
# ARG NEXT_PUBLIC_WEBHOOK_TRIGGER_URL

ENV NEXT_PUBLIC_API_URL=http://localhost:3200
ENV NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3200
ENV NEXT_PUBLIC_WEBHOOK_TRIGGER_URL=http://localhost:3200/webhook/trigger

RUN echo "=================== ENV VARS ===================\n"; \
    echo "API URL: ${NEXT_PUBLIC_API_URL}\n"; \
    echo "WEBSOCKET URL: ${NEXT_PUBLIC_WEBSOCKET_URL}\n"; \
    echo "WEBHOOK URL: ${NEXT_PUBLIC_WEBHOOK_TRIGGER_URL}\n"; \
    echo "================================================="

# Build the application
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
