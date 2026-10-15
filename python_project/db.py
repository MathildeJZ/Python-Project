
import sqlite3

def get_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # Tabel til huskesedler
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL
        )
    """)

    # Tabel til lister/kategorier
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    """)

    # Opret de eksisterende standardkategorier
    default_categories = [
        "Indkøb",
        "Arbejde",
        "Studie",
        "Rejse",
        "Rengøring",
        "Børn",
        "Økonomi",
        "Projekter",
        "Personlige mål"
    ]

    for category in default_categories:
        cursor.execute(
            "INSERT OR IGNORE INTO categories (name) VALUES (?)",
            (category,)
        )

    conn.commit()
    conn.close()
