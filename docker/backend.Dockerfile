FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema and generate client
COPY backend/prisma ./prisma
RUN pnpm prisma generate

# Copy the rest of the application
COPY backend .

# Build the application
RUN pnpm build

# Expose the port (assuming your Hono.js app runs on port 3001)
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]
