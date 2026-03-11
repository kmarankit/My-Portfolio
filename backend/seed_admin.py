import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Use the same hashing logic as your auth_handler
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed():
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client.portfolio_db 
    collection = db.get_collection("admins")

    email = "ak373714@gmail.com" # Use this to login in React
    password = "Kumarankit@1" # Use this to login in React
    
    hashed_password = pwd_context.hash(password)

    admin_data = {
        "email": email,
        "password": hashed_password,
        "is_admin": True
    }

    # Clear old attempts and insert new one
    await collection.delete_many({"email": email})
    await collection.insert_one(admin_data)
    print(f"✅ Admin created! Email: {email} | Password: {password}")

if __name__ == "__main__":
    asyncio.run(seed())