from fastapi import FastAPI
from pydantic import BaseModel
import db

class Item(BaseModel):
    id: int | None = None
    name: str
    category: str

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
def create_item(item: Item):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO items (name, category) VALUES (?, ?)",
        (item.name, item.category)
    )
    conn.commit()

    return {"message": "Item created", "name": item.name, "category": item.category}
