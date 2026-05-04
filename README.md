# Airport Luggage Handling App

Class demo project for an airport luggage handling workflow. The app has a
React/Vite frontend, a Flask backend API, and a MySQL database.

## Project Layout

- `src/` - React frontend screens and demo state.
- `src/api/` - frontend API helper for backend login and initial data loading.
- `src/GlobalData/ApplicationData.jsx` - shared React state used by the frontend.
- `src/SQL/` - MySQL setup and demo SQL scripts.
- `backend/` - Flask backend API.
- `backend/app/routers/` - Flask routes for auth, flights, passengers, bags, staff, messages, and departure.
- `backend/app/domain/` - domain classes such as `Flight`, `Passenger`, `Bag`, and `Staff`.
- `backend/app/db_interfaces/` - MySQL query helpers.
- `public/` - static frontend assets.

## Prerequisites

- Node.js and npm
- Python 3
- MySQL
- Docker Desktop, optional, if local MySQL setup is difficult

## Backend Setup

From the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -c "import secrets; print(secrets.token_hex(32))"
```

Paste the generated secret into `backend/.env` as `JWT_SECRET`.

Important: `backend/.env` is local only. Do not commit real `.env` files or
real credentials.

Start the backend:

```powershell
cd backend
.\venv\Scripts\activate
python run.py
```

The backend should run at `http://localhost:5000`.

Health check:

```powershell
Invoke-RestMethod http://localhost:5000/health
```

## Local MySQL Setup Without Docker

Use this path when MySQL is installed directly on the computer and listening on
port `3306`.

Expected `backend/.env` database settings:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db
DB_USER=cs5336
DB_PASSWORD=password
```

From the repository root, run the setup SQL with a MySQL admin account:

```powershell
mysql -u root -p < src\SQL\db_setup.sql
```

`src/SQL/db_setup.sql` creates:

- database `db`
- MySQL user `cs5336`@`localhost`
- required project tables
- demo airline, flight, passenger, bag, staff, and message data
- bcrypt-hashed demo staff passwords
- the `Message` table schema expected by the backend message API

After setup, backend login should work with the demo accounts below.

## Optional Docker MySQL Setup

Docker can be used instead of local MySQL. This is useful if port `3306` is
already used or local MySQL permissions are hard to configure.

Use host port `3307` to avoid conflicting with local MySQL:

```powershell
docker run -d --name luggage-mysql-cs7336 -e MYSQL_ROOT_PASSWORD=rootpassword -p 3307:3306 mysql:8.0
```

Then run only the setup SQL inside that project database environment. Do not run
`src/SQL/db_demo.sql` for setup.

Expected `backend/.env` database settings for Docker:

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=db
DB_USER=cs5336
DB_PASSWORD=password
```

## SQL File Notes

- `src/SQL/db_setup.sql` is the initial setup file.
- `src/SQL/db_demo.sql` is not the initial setup file.
- `src/SQL/db_demo.sql` contains demo `INSERT`, `UPDATE`, and `DELETE`
  operations and should not be run casually.
- The old `drop database db;` line in `src/SQL/db_setup.sql` is commented out.
  Do not uncomment it unless you intentionally want to delete the project
  database.
- `src/SQL/db_setup.sql` is intended for a fresh project database. It may fail
  if database `db`, user `cs5336`@`localhost`, or seeded rows already exist.

## Frontend Setup

From the repository root:

```powershell
npm install
npm run dev
```

The frontend runs at:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Useful frontend commands:

```powershell
npm run build
npm run lint
```

## Backend URL

- Backend API: `http://localhost:5000`
- Health check: `GET /health`

## Demo Accounts

- `ACarnline` / `Password123` - Airline Staff
- `PMahomes` / `Password456` - Gate Staff
- `JDoe` / `Password789` - Ground Staff
- `Admin` / `Password000` - Admin

## Current Working Features

- backend health check
- staff login
- JWT authentication
- frontend login connected to backend `POST /auth/login`
- frontend loads flights, passengers, and bags from backend after login
- demo staff passwords stored as bcrypt hashes in setup SQL
- `Message` table schema aligned with backend message API
- CORS supports the local Vite frontend on `localhost` and `127.0.0.1`
- login page responsive layout fixed for narrow desktop/browser widths

## Known Limitations / TODO

- Many add, delete, update, check-in, board, and load actions are still frontend
  in-memory operations and are not fully persisted to the backend database.
- Frontend message sending/display may still use local React state.
- Baggage access permission rules should be confirmed before the final demo. The
  current `GET /bags?flight_id=...` route is JWT-protected but does not restrict
  results by staff airline.
- Teammates should verify local MySQL setup on their own machines.
- Do not commit real `.env` files or real credentials.
