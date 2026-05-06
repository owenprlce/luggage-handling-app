import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

load_dotenv()

_pool = None


def get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="airport_pool",
            pool_size=5,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            database=os.getenv("DB_NAME", "db"),
            user=os.getenv("DB_USER", "cs5336"),
            password=os.getenv("DB_PASSWORD", "password"),
        )
    return _pool


def get_connection():
    conn   = get_pool().get_connection()
    cursor = conn.cursor(dictionary=True)
    return conn, cursor


def get_db():
    conn, cursor = get_connection()
    try:
        yield conn, cursor
    finally:
        cursor.close()
        conn.close()
