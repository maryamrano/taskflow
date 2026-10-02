# TaskFlow API

Backend API for **DecodeLabs Full Stack Project 2** (Batch 2026) — *"Backend API Development"*.
A task-management REST API built with **Next.js Route Handlers**, **Prisma**, **SQLite**, and
**Zod** validation. No visual flair by design — this project is the application's brain:
robust endpoints, validated input, and clean data flow.

## Tech stack

| Layer      | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router) — API via Route Handlers                    |
| Language   | TypeScript (strict)                                                 |
| Validation | Zod — every input validated before touching the database            |
| ORM / DB   | Prisma + SQLite (zero setup, file-based)                            |
| Structure  | Layered: `route.ts` → `lib/services` → Prisma                       |

## Project structure

```
taskflow-api/
├── app/
│   ├── api/
│   │   ├── health/route.ts        # GET  service status
│   │   ├── users/route.ts         # GET  list / POST create
│   │   ├── users/[id]/route.ts    # GET  one user + their tasks
│   │   ├── tasks/route.ts         # GET  list (filters) / POST create
│   │   └── tasks/[id]/route.ts    # GET / PATCH / DELETE one task
│   ├── layout.tsx / page.tsx      # minimal API index page
│   └── globals.css
├── lib/
│   ├── db.ts                      # Prisma client singleton
│   ├── http.ts                    # JSON envelopes + status helpers
│   ├── validation.ts              # Zod schemas (single source of truth)
│   └── services/                  # business logic (users.ts, tasks.ts)
├── prisma/schema.prisma           # User, Task models
└── .env                           # DATABASE_URL (SQLite file)
```

**Design rules**

- Route handlers are thin: parse → validate → call service → respond. No SQL in routes.
- All services live in `lib/services/` and are framework-agnostic.
- Every response uses one envelope: `{ success: true, data }` or
  `{ success: false, error: { code, message, details? } }`.
- Validation failures return `400` with per-field issues; missing records `404`;
  duplicate email `409`; unexpected failures `500` (never leak internals).

## Run it (Windows)

Prerequisites: **Node.js 18.18+** (`node --version` to check).

```powershell
cd "D:\Decode Labs Internship\taskflow-api"   # wherever you place the folder
npm install
npx prisma migrate dev --name init   # creates prisma/dev.db
npm run dev
```

Open http://localhost:3000 — the index page lists every endpoint.
Health check: http://localhost:3000/api/health

Useful scripts:

```powershell
npm run dev        # development server
npm run build      # production build check
npm start          # serve the production build
npx prisma studio  # visual DB browser at http://localhost:5555
```

## API reference

Base URL: `http://localhost:3000`

### Users

| Method | Endpoint          | Body / notes                                   |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/api/users`    | list all users                                 |
| POST   | `/api/users`    | `{ "name": "Maryam", "email": "m@example.com" }` |
| GET    | `/api/users/:id`| one user with their tasks                      |

### Tasks

| Method | Endpoint          | Body / notes                                                        |
| ------ | ----------------- | ------------------------------------------------------------------- |
| GET    | `/api/tasks`      | optional `?status=TODO&userId=...&q=search`                         |
| POST   | `/api/tasks`      | `{ "title": "...", "description?": "...", "status?": "TODO", "priority?": "HIGH", "userId": "..." }` |
| GET    | `/api/tasks/:id`  | one task with its user                                              |
| PATCH  | `/api/tasks/:id`  | any subset of `{ title, description, status, priority }`             |
| DELETE | `/api/tasks/:id`  | `{ "deleted": true, "id": "..." }`                                  |

`status` ∈ `TODO | IN_PROGRESS | DONE`, `priority` ∈ `LOW | MEDIUM | HIGH`.

### Example

```powershell
# create a user
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{"name":"Maryam","email":"maryam@example.com"}'

# create a task for that user (paste the returned user id)
curl -X POST http://localhost:3000/api/tasks `
  -H "Content-Type: application/json" `
  -d '{"title":"Finish Project 2 API","priority":"HIGH","userId":"<id>"}'

# validation failure example -> 400 with field-level issues
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{"name":"M","email":"not-an-email"}'
```

### Response shapes

Success (`200` / `201`):

```json
{ "success": true, "data": { "id": "cm...", "name": "Maryam" } }
```

Failure (`400` / `404` / `409` / `500`):

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": { "issues": [{ "path": "email", "message": "Invalid email address" }] }
  }
}
```

## How this maps to the Project 2 spec

- ✅ API endpoints (GET / POST — plus PATCH / DELETE for a complete resource)
- ✅ Handles user input and responses (JSON in, enveloped JSON out)
- ✅ Validates basic data (Zod schemas on every write + query params)
- ✅ Key skills: backend development, server-side logic, API concepts
