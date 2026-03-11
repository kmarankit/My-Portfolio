from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.database.mongodb import database
from app.auth.auth_handler import verify_token
from typing import Optional, Any

router = APIRouter()
content_collection = database.get_collection("content")

class ContentPayload(BaseModel):
    section: str
    content: Any

@router.get("")
async def get_content(section: Optional[str] = Query(default=None)):
    query = {"section": section} if section else {}
    items = await content_collection.find(query).to_list(100)
    for item in items:
        item["_id"] = str(item["_id"])
    return items

@router.post("")
async def upsert_content(payload: ContentPayload, _payload=Depends(verify_token)):
    result = await content_collection.update_one(
        {"section": payload.section},
        {"$set": {"section": payload.section, "content": payload.content}},
        upsert=True,
    )
    return {"updated": result.modified_count, "upserted_id": str(result.upserted_id) if result.upserted_id else None}
