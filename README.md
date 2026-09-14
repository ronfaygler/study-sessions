# Study Sessions

A study session platform where teachers host topics and students join them. Includes JWT-based authentication with `teacher`/`student` roles.

## Tech Stack

- **Frontend**: React (Vite), React Router
- **Backend**: Node.js, Express, PostgreSQL
- **Testing**: Vitest (frontend), Jest (backend)

## Project Structure

```
backend/    Express API, JWT auth, PostgreSQL
frontend/   React app (Vite)
```

## Prerequisites

- Node.js 18+
- PostgreSQL running locally

## Setup

1. **Create the databases**
   ```
   createdb study-sessions
   createdb study-sessions-test
   psql -d study-sessions -f backend/src/db/schema.sql
   ```

2. **Backend**
   ```
   cd backend
   npm install
   cp .env.example .env        # fill in your DB credentials and a JWT secret
   npm run dev                 # starts on the PORT set in .env
   ```

3. **Frontend**
   ```
   cd frontend
   npm install
   cp .env.example .env        # VITE_API_URL should point at the backend
   npm start                   # starts the Vite dev server
   ```

## Testing

```
cd backend && npm test
cd frontend && npm test
```

## API Overview

| Method | Route            | Auth              | Description                     |
|--------|------------------|--------------------|----------------------------------|
| POST   | `/auth/register` | -                  | Register a new user              |
| POST   | `/auth/login`    | -                  | Log in, returns a JWT            |
| GET    | `/topics`        | Bearer token, teacher only | List topics, optional `?search=` |
