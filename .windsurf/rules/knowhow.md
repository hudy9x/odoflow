---
trigger: always_on
---

Package manager is pnpm. And it has been installed already.

## Regarding Frontend
- it locates ./frontend
- it uses next.js
- it uses shadcn for ui components
- it always define authentication pages in ./frontend/src/app/(auth) folder
- it always define other pages in ./frontend/src/app/(routes) folder
- it DOES NOT define logic inside page.tsx. But move the logic to ./frontend/src/app/features folder.
- every requests to backend must be in ./frontend/src/app/services
- the component name must follow PascalCase, event folder name in ./frontend/src/app/features

## Frontend Service
- all service must defined in ./frontend/src/app/services
- the api endpoint should be used as follow: const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


## Regarding Backend
- it locates ./backend
- it defines routers in ./backend/src/controllers folder
- when define new router, you must import it to ./backend/src/index.ts file
- schema locates in ./backend/prisma/schema.prisma file