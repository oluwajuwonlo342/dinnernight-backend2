# Moor Plantation — Dinner Night Award Voting Platform

A full-stack, secure award-voting platform built with **React + Vite + Tailwind CSS** (frontend) and
**Node.js + Express + MongoDB** (backend). Gold / black / white award-night theme, JWT auth, bcrypt password
hashing, and a full admin panel for managing categories, nominees, students, and live results.

```
dinner-night-awards/
├── backend/     Express + MongoDB REST API
└── frontend/    React (Vite) client
```

## 1. Prerequisites

- Node.js 18+
- MongoDB (local install or a free MongoDB Atlas cluster)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dinner_night_awards
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123!
```

Create the default admin account (reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`):

```bash
npm run seed:admin
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In development, Vite proxies `/api` and `/uploads` requests to
`http://localhost:5000` (see `vite.config.js`), so no extra `.env` is required locally.

For production, build the frontend (`npm run build`) and serve the `dist/` folder from any static host or
from Express itself, and set the real API URL via a reverse proxy or by adjusting `src/api/axios.js`.

## 4. Using the platform

**Students**
1. Go to `/register` to create an account (matric number must be unique).
2. Log in at `/login` with matric number + password.
3. On the dashboard, pick one nominee per category and submit once. Voting is blocked automatically once
   the student has voted or if the admin has closed voting.

**Admin**
1. Go to `/admin/login` and sign in with the account created via `npm run seed:admin`.
2. From the dashboard you can:
   - View summary cards (students, votes, categories, nominees).
   - Create/edit/delete award **categories**.
   - Add/edit/delete **nominees** with image uploads.
   - Open/close **voting** and set an optional countdown close time.
   - Search & paginate the **student register**.
   - View **live results** (auto-refreshes every 10s) with a progress bar per nominee.
   - **Export results as CSV**.

## 5. Security notes

- Passwords are hashed with bcrypt before being stored (`Student` and `Admin` models).
- All private routes are protected with JWT (`Authorization: Bearer <token>`), issued separately for
  students and admins so one token cannot be used to access the other's routes.
- A student can only submit one vote per category — enforced both in application logic and with a
  MongoDB unique compound index (`studentId + categoryId`) as a hard safety net, wrapped in a transaction.
- Login endpoints are rate-limited to slow brute-force attempts.
- Uploaded nominee images are validated by file type/size (multer) and served as static files.

## 6. Tech stack

**Backend:** Express, Mongoose, JWT, bcryptjs, express-validator, multer, helmet, express-rate-limit
**Frontend:** React, React Router, Axios, React Hook Form, Context API, Tailwind CSS, Framer Motion,
React Toastify, react-icons
