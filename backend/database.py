import sqlite3
import os
from config import DB_PATH

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            avatar TEXT DEFAULT '',
            is_verified INTEGER DEFAULT 0,
            is_banned INTEGER DEFAULT 0,
            otp_code TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Facilities Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            address TEXT NOT NULL,
            location TEXT NOT NULL,
            sports TEXT NOT NULL,
            amenities TEXT NOT NULL,
            image TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            rejection_comment TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    # Courts Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            facility_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            sport_type TEXT NOT NULL,
            price_per_hour REAL NOT NULL,
            opening_time TEXT NOT NULL DEFAULT '06:00',
            closing_time TEXT NOT NULL DEFAULT '22:00',
            is_active INTEGER DEFAULT 1,
            FOREIGN KEY (facility_id) REFERENCES facilities (id) ON DELETE CASCADE
        )
    ''')

    # Bookings Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            facility_id INTEGER NOT NULL,
            court_id INTEGER NOT NULL,
            booking_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Confirmed',
            payment_status TEXT NOT NULL DEFAULT 'Paid (Demo)',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (facility_id) REFERENCES facilities (id),
            FOREIGN KEY (court_id) REFERENCES courts (id)
        )
    ''')

    # Reviews Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            facility_id INTEGER NOT NULL,
            booking_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (facility_id) REFERENCES facilities (id),
            FOREIGN KEY (booking_id) REFERENCES bookings (id)
        )
    ''')

    # Blocked Slots Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blocked_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            court_id INTEGER NOT NULL,
            booking_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            reason TEXT NOT NULL DEFAULT 'Maintenance',
            FOREIGN KEY (court_id) REFERENCES courts (id) ON DELETE CASCADE
        )
    ''')

    # Ensure payment_method column exists in bookings table
    try:
        cursor.execute("ALTER TABLE bookings ADD COLUMN payment_method TEXT DEFAULT 'UPI Instant'")
    except Exception:
        pass

    # Ensure image column exists in reviews table
    try:
        cursor.execute("ALTER TABLE reviews ADD COLUMN image TEXT DEFAULT ''")
    except Exception:
        pass

    # Migrate any legacy dummy 'Paid (Demo)' records to proper payment methods
    try:
        cursor.execute("UPDATE bookings SET payment_status = 'Paid (Online)', payment_method = 'UPI Instant' WHERE payment_status = 'Paid (Demo)' OR payment_method = 'UPI'")
    except Exception:
        pass

    conn.commit()
    conn.close()

def query_db(query, args=(), one=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    rv = cursor.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def dict_from_row(row):
    return dict(row) if row else None

def dicts_from_rows(rows):
    return [dict(r) for r in rows] if rows else []
