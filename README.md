# OdoFlow

A powerful workflow automation platform built with Next.js and Node.js.

## Tech Stack

### Frontend
- Next.js
- Shadcn UI Components
- TypeScript
- Tailwind CSS

### Backend
- Honojs
- Prisma (ORM)
- TypeScript

## Project Structure

```
.
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/          
│   │   │   ├── (auth)/    # Authentication pages
│   │   │   ├── (routes)/  # Application routes
│   │   │   ├── features/  # Feature components and logic
│   │   │   └── services/  # API service calls
│   │   └── components/    # Reusable UI components
│   │
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # API route controllers
│   │   └── index.ts      # Main application entry
│   └── prisma/          
│       └── schema.prisma  # Database schema
└── README.md
```

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)
- Docker and Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hudy9x/odoflow.git
cd odoflow
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local

# Backend (.env)
cp backend/.env.example backend/.env
```

4. Start the required services using Docker Compose:

```bash
# Build and start containers
docker build -t odo-frontend -f ./docker/frontend.Dockerfile .
docker build -t odo-backend -f ./docker/backend.Dockerfile .

# Start PostgreSQL and Redis in detached mode using docker-compose.yml
docker compose -f docker-compose.yml up -d

# Verify services are running
docker compose ps
```

5. Start the development servers:

```bash
# Start frontend (from frontend directory)
pnpm dev

# Start backend (from backend directory)
pnpm dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Development Guidelines

### Frontend
- All authentication pages should be placed in `frontend/src/app/(auth)`
- Application pages should be placed in `frontend/src/app/(routes)`
- Business logic should be separated into `frontend/src/app/features`
- API requests should be centralized in `frontend/src/app/services`
- Component names must follow PascalCase convention

### Backend
- API routes are defined in `backend/src/controllers`
- New routes must be imported and registered in `backend/src/index.ts`
- Database schema modifications should be made in `backend/prisma/schema.prisma`

## License

[Your chosen license]
