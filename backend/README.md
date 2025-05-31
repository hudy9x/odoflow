# Backend Service

This is the backend service built with Bun, Hono, and Prisma with PostgreSQL database.

## Prerequisites

- [Bun](https://bun.sh) installed
- Docker and Docker Compose (for PostgreSQL)
- PostgreSQL running (via Docker Compose)

## Setup

1. Install dependencies:
```sh
bun install
```

2. Set up your environment:
```sh
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL connection string
```

3. Initialize the database:
```sh
bun run db:deploy  # Apply all migrations
```

## Development

Start the development server:
```sh
bun run dev
```

The server will be available at http://localhost:3000

## Database Commands

- Apply migrations: `bun run db:deploy`
- Reset database: `bun run db:reset`
- Push schema changes (dev only): `bun run db:push`
- Create new migration: `bunx prisma migrate dev --name <migration-name>`

## Testing

Run the test suite:
```sh
bun test
```

Or run specific tests:
```sh
bun test tests/user.test.ts
```
