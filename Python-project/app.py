from fastapi import FastAPI
import db

app = FastAPI()

# GET → hent alle items
@app.get("/items")
def get_items():
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM items")
    rows = cursor.fetchall()

    return [dict(row) for row in rows]

# POST → indsæt et item
@app.post("/items")
def create_item(name: str):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO items (name) VALUES (?)", (name,))
    conn.commit()

    return {"message": "Item created", "name": name}

