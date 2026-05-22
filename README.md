# Store Rating App

A full-stack web application where users can submit ratings for stores.

## Tech Stack
- Backend: ExpressJS (JavaScript)
- Database: MySQL with Prisma ORM
- Frontend: React + Vite + Tailwind CSS
- Auth: JWT

## Project Structure
```
store-rating-app/
  backend/
    prisma/schema.prisma       # Database schema
    src/
      controllers/             # Business logic
      middleware/              # JWT auth middleware
      routes/                  # API route definitions
      utils/                   # Prisma client, helpers
      index.js                 # App entry point
  frontend/
    src/
      components/              # Shared UI components
      context/                 # Auth context (global state)
      pages/
        admin/                 # Admin pages
        user/                  # Normal user pages
        storeowner/            # Store owner pages
      utils/                   # API client, validators
      App.jsx                  # Routes
```

## Setup Instructions

### 1. Create the MySQL database
```sql
CREATE DATABASE store_rating_db;
```

### 2. Configure backend environment
Edit `backend/.env`:
```
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/store_rating_db"
JWT_SECRET="your_secret_key"
PORT=5000
```

### 3. Install dependencies
```bash
# From root folder
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run Prisma migration (creates all tables)
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the backend
```bash
cd backend
npm run dev
```

### 6. Start the frontend
```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:5000

## User Roles
- **ADMIN**: Created manually via Prisma or by another admin. Can manage users and stores.
- **USER**: Can register via /register. Can view and rate stores.
- **STORE_OWNER**: Created by admin. Can view their store dashboard and ratings received.

## Creating the First Admin
Since there is no seed script, create the first admin directly in the database:
```sql
INSERT INTO User (name, email, password, address, role, createdAt)
VALUES (
  'Administrator Account Name',
  'admin@example.com',
  '$2a$10$HASHED_PASSWORD',
  '123 Admin Street',
  'ADMIN',
  NOW()
);
```
Or use Prisma Studio:
```bash
cd backend
npx prisma studio
```

## API Endpoints
| Method | Path | Access |
|--------|------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/users/profile | Authenticated |
| PUT | /api/users/password | Authenticated |
| GET | /api/stores | Authenticated |
| POST | /api/ratings | USER only |
| GET | /api/admin/dashboard | ADMIN only |
| GET/POST | /api/admin/users | ADMIN only |
| GET | /api/admin/users/:id | ADMIN only |
| GET/POST | /api/admin/stores | ADMIN only |
| GET | /api/admin/my-store | STORE_OWNER only |
