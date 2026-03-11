from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.database.mongodb import database

router = APIRouter()
contact_collection = database.get_collection("contact_messages")

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    msg: str

@router.post("")
async def submit_contact(message: ContactMessage):
    doc = message.dict()
    result = await contact_collection.insert_one(doc)
    return {"id": str(result.inserted_id)}
