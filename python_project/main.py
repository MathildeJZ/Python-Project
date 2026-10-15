
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


class Item(BaseModel):
    id: int | None = None
    name: str
    category: str


class Category(BaseModel):
    id: int | None = None
    name: str


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Opret tabeller, hvis de ikke findes
db.create_tables()


# HENT ALLE HUSKESEDLER
@app.get("/items")
def get_items():
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM items")
    rows = cursor.fetchall()

    conn.close()
    return [dict(row) for row in rows]


# OPRET EN HUSKESEDDEL
@app.post("/items")
def create_item(item: Item):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO items (name, category) VALUES (?, ?)",
        (item.name, item.category)
    )

    conn.commit()
    conn.close()

    return {"message": "Item created", "name": item.name}


# SLET EN HUSKESEDDEL
@app.delete("/items/{id}")
def delete_item(id: int):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM items WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return {"message": "Item deleted", "id": id}


# HENT ALLE LISTER
@app.get("/categories")
def get_categories():
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM categories ORDER BY id")
    rows = cursor.fetchall()

    conn.close()
    return [dict(row) for row in rows]


# OPRET EN NY LISTE
@app.post("/categories")
def create_category(category: Category):
    name = category.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Listen skal have et navn."
        )

    conn = db.get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO categories (name) VALUES (?)",
            (name,)
        )
        conn.commit()

        new_id = cursor.lastrowid

        return {
            "id": new_id,
            "name": name
        }

    except Exception as error:
        conn.rollback()

        if "UNIQUE constraint failed" in str(error):
            raise HTTPException(
                status_code=409,
                detail="En liste med det navn findes allerede."
            )

        raise

    finally:
        conn.close()


# SLET EN LISTE OG DENS HUSKESEDLER
@app.delete("/categories/{id}")
def delete_category(id: int):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM categories WHERE id = ?", (id,))
    category = cursor.fetchone()

    if category is None:
        conn.close()
        raise HTTPException(
            status_code=404,
            detail="Listen blev ikke fundet."
        )

    cursor.execute(
        "DELETE FROM items WHERE category = ?",
        (category["name"],)
    )

    cursor.execute("DELETE FROM categories WHERE id = ?", (id,))

    conn.commit()
    conn.close()

    return {
        "message": "Liste og tilhørende huskesedler slettet",
        "id": id
    }
