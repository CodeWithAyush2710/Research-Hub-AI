import os
from pymongo import MongoClient
import certifi

MONGODB_URI = os.getenv("MONGODB_URI", "")

client = None
db = None
users_collection = None
analyses_collection = None
guest_limits_collection = None

if MONGODB_URI:
    try:
        # Use certifi for TLS verify issue often seen with Python MongoDB
        client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
        db = client.research_hub
        users_collection = db.users
        analyses_collection = db.analyses
        guest_limits_collection = db.guest_limits
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
else:
    print("⚠️ MONGODB_URI not set. Database not connected.")
