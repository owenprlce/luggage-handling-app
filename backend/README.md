# Airport Luggage Handling — Flask Backend
 
## Setup
 
### 1. Install dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate for Windows
pip install -r requirements.txt
```
 
### 2. Configure environment
```bash
cp .env.example .env
# Fill in .env file with MySQL credentials and generate a JWT secret:
python -c "import secrets; print(secrets.token_hex(32))"
```
 
### 3. Set up the database
```bash
mysql -u root -p < db_setup.sql    # SQL file to setup the database is located at src/SQL
python hash_passwords.py           # prints UPDATE statements for bcrypt hashes
# Paste the output into migration.sql, then:
mysql -u root -p < migration.sql
```
 
### 4. Run the server
```bash
python run.py
# Server starts at http://localhost:5000
```
 
---
 
