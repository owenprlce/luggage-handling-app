# Airport Luggage Handling App

## Project Overview

This is a class demo project for an airport luggage handling workflow. It uses a
React/Vite frontend, a Flask backend API, and a MySQL database.

## Quick Start

1. Install frontend and backend dependencies.
2. Create your own local `backend/.env`.
3. Set up MySQL using `src/SQL/db_setup.sql`.
4. Start the backend at `http://localhost:5000`.
5. Start the frontend at `http://localhost:5173` or `http://127.0.0.1:5173`.

Health check:

```powershell
Invoke-RestMethod http://localhost:5000/health
```

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

`backend/.env` is local only. Do not commit real `.env` files or real
credentials.

Start the backend:

```powershell
cd backend
.\venv\Scripts\activate
python run.py
```

Backend URL: `http://localhost:5000`

## Database Setup

### Local MySQL

Use this as the main setup path when MySQL is installed locally on port `3306`.

Expected `backend/.env` database settings:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db
DB_USER=cs5336
DB_PASSWORD=password
```

Run the setup SQL from the repository root with a MySQL admin account:

```powershell
mysql -u root -p < src\SQL\db_setup.sql
```

`db_setup.sql` creates database `db`, required tables, demo data, bcrypt-hashed
demo passwords, and MySQL user `cs5336`@`localhost`.

### Optional Docker MySQL

Docker can be used if local MySQL is difficult to configure. Use host port
`3307` to avoid conflicts with local MySQL:

```powershell
docker run -d --name luggage-mysql-cs7336 -e MYSQL_ROOT_PASSWORD=rootpassword -p 3307:3306 mysql:8.0
```

Wait for the container to fully start, then run the setup SQL against port
`3307`:

```powershell
mysql -h 127.0.0.1 -P 3307 -u root -p < src\SQL\db_setup.sql
```

Expected `backend/.env` database settings for Docker:

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=db
DB_USER=cs5336
DB_PASSWORD=password
```

If the backend cannot connect as `cs5336`, the Docker MySQL instance may need a
host-connection grant. First enter the Docker MySQL prompt:

```powershell
docker exec -it luggage-mysql-cs7336 mysql -u root -p
```

Then run:

```sql
CREATE USER IF NOT EXISTS 'cs5336'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON db.* TO 'cs5336'@'%';
FLUSH PRIVILEGES;
```

Do not run `src/SQL/db_demo.sql` for setup.

## Frontend Setup

From the repository root:

```powershell
npm install
npm run dev
```

Frontend URLs:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Useful command:

```powershell
npm run build
```

## Demo Accounts

- `ACarnline` / `Password123` - Airline Staff
- `PMahomes` / `Password456` - Gate Staff
- `JDoe` / `Password789` - Ground Staff
- `Admin` / `Password000` - Admin

## Recent Integration Changes

- Demo staff passwords in `src/SQL/db_setup.sql` were changed to bcrypt hashes.
- `Message` table schema was updated to match the backend message API.
- Frontend login is connected to backend `POST /auth/login`.
- A frontend API helper was added.
- Frontend loads flights, passengers, and bags from backend after login.
- CORS was fixed for `localhost:5173` and `127.0.0.1:5173`.
- Login page responsive layout was fixed.
- Several frontend layout issues were adjusted for demo stability.
- Some dashboard, table, and form layouts were adjusted to reduce overlapping or
  off-screen content.
- Add Staff form title/layout overlap was fixed.
- Local MySQL and optional Docker setup notes were added.

## Current Working Features

- Backend health check works.
- Staff login works.
- JWT authentication works.
- Frontend login connects to backend.
- Frontend loads flights, passengers, and bags from backend after login.
- `Message` table schema is aligned with backend message API.
- Local CORS supports the Vite frontend.
- Login page layout is fixed for narrower browser windows.
- Add Flight

## Remaining Work / Known Limitations

- Many actions are still frontend in-memory and may not persist after refresh or
  re-login, including:
  - Delete Flight
  - Add Passenger
  - Check-in Passenger
  - Board Passenger
  - Add Staff / Delete Staff
  - Load Bag
  - Update Bag Location
  - Send Message
- Frontend message sending/display may still need backend integration.
- Baggage access permission rules still need confirmation.
- Currently, `GET /bags?flight_id=...` is JWT-protected but does not restrict
  results by staff airline.
- Teammates should confirm whether any expected features are still missing or
  incomplete, such as forgot password/password recovery.
- Teammates should verify MySQL setup on their own machines.

## SQL Notes

- `src/SQL/db_setup.sql` is the setup file.
- `src/SQL/db_demo.sql` is not the initial setup file.
- `src/SQL/db_demo.sql` contains demo `INSERT`, `UPDATE`, and `DELETE`
  operations and should not be run casually.
- The old `DROP DATABASE db;` line in `db_setup.sql` is commented out.
- `db_setup.sql` is best for a fresh project database and may fail or need
  adjustment if `db`, `cs5336`, or seeded rows already exist.
