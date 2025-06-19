# 🌊 OdoFlow

A powerful workflow automation platform built with Next.js and Node.js.

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)
- Docker and Docker Compose

## 🛠️ Tech Stack

| Category | Technologies |
|----------|---------------|
| Frontend | Next.js, Shadcn UI Components, TypeScript, Tailwind CSS |
| Backend  | Honojs, Prisma (ORM), TypeScript, Redis, PostgreSQL |

## 🚀 Production Deployment

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

## 📄 License

The MIT License (MIT)

Copyright (c) 2022 odo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
