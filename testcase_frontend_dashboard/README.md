# Test Case Frontend Dashboard (Retro Theme)

Retro-themed React dashboard for the AI-powered Test Case Management System.

## Features
- JWT auth (login/register) with persistent session
- Role-based routing guards: Admin / QA / Developer
- Dashboard with charts (Recharts)
- Pages scaffolded for: Projects, Test Cases (tags + filtering), Executions (manual + automation trigger + logs), Bugs, Reports, AI Generation, Settings
- REST API client (fetch wrapper) with token header

## Environment Variables
Create a `.env` (do not commit it) and set:

- `REACT_APP_API_BASE_URL` (example: `http://localhost:3001`)

See `.env.example`.

## Run locally
```bash
npm install
npm start
```

App runs on http://localhost:3000

## Notes
- The backend Swagger/OpenAPI exposed in `/docs` appears to be minimal (health endpoint only). The frontend is implemented against the intended REST paths:
  - `/auth/*`, `/projects`, `/modules`, `/testcases`, `/executions`, `/logs`, `/bugs`, `/dashboard`, `/ai/generate`
- If any endpoint shapes differ, adjust the small API modules under `src/api/*`.
"
