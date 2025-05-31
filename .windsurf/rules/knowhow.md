---
trigger: always_on
---

## Common notes

Backend is bunjs, you can find the backend in ./backend/src
Backend is Honojs
Frontend is nextjs, you can find it in ./frontend
You must install packages with bunjs in ./backend
You must install packages with bunjs in ./frontend

## About Frontend
- When creating a new page or router, only create folder, page.tsx, layout.tsx (if needed) and place all logics in ./frontend/src/app/features folder. Ex: app/features/Workflow/index.tsx or app/features/Login/index.tsx
- Create a new pages inside ./frontend/app/(routes) folder
- Create sign in, sign up, forget password, ... to ./frontend/app/(auth) folder

- Separate the concern into small components for easy to maintain.
- Use Shadcn ui for any components
- When sending a request to backend, create a new method or file inside ./frontend/src/app/services