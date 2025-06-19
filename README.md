# 🌊 Odoflow

A lightweight workflow automation platform built with Next.js and Honojs.

![Commit Activity](https://img.shields.io/github/commit-activity/t/hudy9x/odoflow.svg)
![GitHub](https://img.shields.io/github/license/hudy9x/odoflow.svg)
![Last Commit](https://img.shields.io/github/last-commit/hudy9x/odoflow.svg)
![Open Issues](https://img.shields.io/github/issues/hudy9x/odoflow.svg)
![Contributors](https://img.shields.io/github/contributors/hudy9x/odoflow.svg)

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)
- Docker and Docker Compose

## 🚀 How to try it

To run the entire application in production mode:

```bash
docker compose up
```

The production environment will be available at:
- Frontend: http://localhost:3100
- Backend API: http://localhost:3200
- Redis: http://localhost:6370
- PostgreSQL: http://localhost:5430

## 💻 Development Setup

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

4. Set up the database and dependencies:

```bash
# Start PostgreSQL and Redis services
docker compose up odo-db odo-redis -d

# Setup database schema and client
cd backend
pnpm deploy     # Deploy database migrations
pnpm generate   # Generate Prisma Client
```

5. Start the development servers:

```bash
# Start backend development server
cd backend      # If not already in backend directory
pnpm dev

# In a new terminal, start frontend development server
cd frontend     # From project root
pnpm dev
```

The development environment will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3003

## 📁 Project Structure

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

## 🛠️ Tech Stack

| Category | Technologies |
|----------|---------------|
| Frontend | Next.js, Shadcn UI Components, TypeScript, Tailwind CSS |
| Backend  | Honojs, Prisma (ORM), TypeScript, Redis, PostgreSQL |

## 📖 Development Guidelines

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
