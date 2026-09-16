from fastapi import FastAPI
from pydantic import BaseModel
import db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

items = [] #liste i RAM, men vi vil bruge en database i stedet

class Item(BaseModel):
    name: str
    
#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Opret tabeller hvis de ikke findes
db.create_tables()

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

    cursor.execute("INSERT INTO items (name) VALUES (?)", (item.name,))
    conn.commit()

    return {"message": "Item created", "name": item.name}

#Delete
@app.delete("/items/{id}")
def delete_item(id: int):
    conn = db.get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM items WHERE id =?", (id,))
    conn.commit()

    return {"message": "Item deleted", "id": id}
