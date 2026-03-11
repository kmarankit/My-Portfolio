import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Get your Mongo URI from .env file
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGO_URL") or "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
database = client.portfolio_db  # Database name
admin_collection = database.get_collection("admins")
