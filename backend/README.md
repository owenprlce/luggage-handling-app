# Airport Luggage Handling Flask Backend

## Setup

### 1. Install dependencies

From the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

On macOS/Linux, use `source venv/bin/activate` instead of the Windows activate command.

### 2. Configure environment

```powershell
copy .env.example .env
python -c "import secrets; print(secrets.token_hex(32))"
```

Open `.env` and set the MySQL values plus `JWT_SECRET`.

### 3. Set up the database

Run this from the repository root, not from `backend/`:

```powershell
mysql -u root -p < src\SQL\db_setup.sql
```

Important: the backend checks staff passwords with bcrypt. If seed passwords in
`db_setup.sql` are plain text, login will not work until those values are
replaced with bcrypt hashes.

### 4. Run the server

```powershell
cd backend
.\venv\Scripts\activate
python run.py
```

The server starts at `http://localhost:5000`.

Health check:

```powershell
curl http://localhost:5000/health
```

## Main Routes

- `POST /auth/login`
- `POST /auth/login/passenger`
- `GET /flights`
- `GET /passengers`
- `GET /bags`
- `GET /staff`
- `GET /messages`
- `GET /departure/<flight_id>/ready`
