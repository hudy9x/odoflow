#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Apply database migrations
echo "Applying database migrations..."
pnpm prisma migrate deploy

echo "==> List current directory"
ls 

echo "==> list /app"
ls /app/dist


# Start the application
echo "==> Starting the application..."
exec pnpm start
