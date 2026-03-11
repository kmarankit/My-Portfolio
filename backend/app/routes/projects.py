from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database.mongodb import database
from app.auth.auth_handler import verify_token
from bson import ObjectId

router = APIRouter()
project_collection = database.get_collection("projects")

class Project(BaseModel):
    title: str
    description: str = ""
    tech: str = ""
    link: str = ""
    published: bool = True

# Public: Fetch all projects
@router.get("")
async def get_projects():
    projects = await project_collection.find().to_list(100)
    for p in projects: p["_id"] = str(p["_id"]) # Convert Mongo ID to string
    return projects

# Protected: Add a project (Needs Token)
@router.post("")
async def create_project(project: Project, _payload=Depends(verify_token)):
    new_project = await project_collection.insert_one(project.dict())
    return {"id": str(new_project.inserted_id)}

@router.delete("/{project_id}")
async def delete_project(project_id: str, _payload=Depends(verify_token)):
    try:
        obj_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project id")

    result = await project_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": project_id}
