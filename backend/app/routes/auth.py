from fastapi import APIRouter, HTTPException, status
from app.models.user import UserLogin 
from app.database.mongodb import admin_collection
# This line was causing the error if 'jwt' wasn't installed
from app.auth.auth_handler import verify_password, create_access_token

router = APIRouter()

@router.post("/login")
async def login(details: UserLogin):
    # 1. Find admin in DB
    admin = await admin_collection.find_one({"email": details.email})
    
    # 2. Check if admin exists and password is correct
    if not admin or not verify_password(details.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 3. Generate Token
    token = create_access_token(data={"sub": admin["email"]})
    return {"access_token": token, "token_type": "bearer"}