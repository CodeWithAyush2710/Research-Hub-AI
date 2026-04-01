from fastapi import FastAPI, HTTPException, Depends, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import os
import datetime
from dotenv import load_dotenv
from data_loader import DataLoader
from ai_processor import AIProcessor
from llm_config import get_llm
from database import users_collection, guest_limits_collection, analyses_collection
from auth import get_password_hash, verify_password, create_access_token, get_current_user, require_auth
from pdf_parser import extract_text_from_pdf
import hashlib
from bson import ObjectId

load_dotenv()

# DEBUG: Print API Key status
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    print(f"🔑 Loaded API Key: {api_key[:4]}...{api_key[-4:]} (Length: {len(api_key)})")
else:
    print("❌ No API Key found in environment variables!")

from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app = FastAPI(title="Research Paper Analyzer AI Service")

# ✅ Trust Proxy Headers (Important for Render/Vercel)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# ✅ Allow CORS for Frontend (Allow all for deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
try:
    llm = get_llm()
    data_loader = DataLoader()
    ai_processor = AIProcessor(llm)
    print("✅ AI Service Initialized Successfully")
except Exception as e:
    print(f"❌ Error initializing AI Service: {e}")
    raise e

class AnalyzeRequest(BaseModel):
    query: str

class PaperResponse(BaseModel):
    title: str
    link: str
    summary: Optional[str] = None
    key_findings: Optional[str] = None
    trends: Optional[str] = None
    advantages_disadvantages: Optional[str] = None
    related_work: Optional[str] = None
    code_implementations: Optional[str] = None
    citations_references: Optional[str] = None
    future_work: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserRegister):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password_hash": get_password_hash(user.password),
        "created_at": datetime.datetime.utcnow()
    }
    result = users_collection.insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/analyze", response_model=List[PaperResponse])
async def analyze_papers(request: AnalyzeRequest, req: Request, current_user: Optional[str] = Depends(get_current_user)):
    """
    Fetch papers from ArXiv and analyze them using AI agents.
    """
    try:
        query = request.query
        print(f"🔍 Received query: {query}")
        
        # Guest IP Limiting
        if not current_user:
            client_ip = req.client.host
            if guest_limits_collection is not None:
                record = guest_limits_collection.find_one({"ip": client_ip})
                if record and record.get("count", 0) >= 1:
                    raise HTTPException(status_code=401, detail="Guest limit exceeded. Please log in to continue.")
                else:
                    guest_limits_collection.update_one(
                        {"ip": client_ip}, 
                        {"$inc": {"count": 1}}, 
                        upsert=True
                    )
        
        # 1. Fetch papers
        papers = data_loader.fetch_arxiv_papers(query)
        if not papers:
            return []
            
        processed_papers = []
        papers_to_process = []
        
        # 2. Check MongoDB Cache
        if analyses_collection is not None:
            for p in papers:
                cached = analyses_collection.find_one({"link": p["link"]})
                if cached:
                    cached.pop("_id", None)
                    processed_papers.append(cached)
                else:
                    papers_to_process.append(p)
        else:
            papers_to_process = papers
            
        # 3. Process new papers
        if papers_to_process:
            new_processed = await ai_processor.process_papers_async(papers_to_process)
            for np in new_processed:
                processed_papers.append(np)
                if analyses_collection is not None:
                    # Save a copy to cache without mutating the returned object unexpectedly
                    analyses_collection.insert_one(np.copy())
        
        return processed_papers
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/pdf", response_model=PaperResponse)
async def analyze_pdf(file: UploadFile = File(...), current_user: str = Depends(require_auth)):
    try:
        content_bytes = await file.read()
        file_hash = hashlib.sha256(content_bytes).hexdigest()
        
        # Check cache
        if analyses_collection is not None:
            cached = analyses_collection.find_one({"hash": file_hash})
            if cached:
                cached.pop("_id", None)
                users_collection.update_one(
                    {"_id": ObjectId(current_user)},
                    {"$addToSet": {"uploaded_papers": cached["title"]}}
                )
                return cached
                
        # Parse PDF
        text = extract_text_from_pdf(content_bytes)
        if len(text) > 15000: # Trim very long papers slightly for the LLM context limit
            text = text[:15000]
            
        paper_data = {
            "title": file.filename,
            "summary": text,
            "link": "Uploaded PDF"
        }
        
        # Process specific paper
        result = await ai_processor.coordinator.process_paper(paper_data)
        result["hash"] = file_hash
        
        if analyses_collection is not None:
            analyses_collection.insert_one(result.copy())
            
        if users_collection is not None:
            users_collection.update_one(
                {"_id": ObjectId(current_user)},
                {"$addToSet": {"uploaded_papers": result["title"]}}
            )
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/review/pdf", response_model=PaperResponse)
async def review_pdf(file: UploadFile = File(...), current_user: str = Depends(require_auth)):
    try:
        content_bytes = await file.read()
        file_hash = hashlib.sha256(content_bytes).hexdigest() + "_review" # differentiate hash from normal analysis
        
        # Check cache
        if analyses_collection is not None:
            cached = analyses_collection.find_one({"hash": file_hash})
            if cached:
                cached.pop("_id", None)
                users_collection.update_one(
                    {"_id": ObjectId(current_user)},
                    {"$addToSet": {"uploaded_papers": "Review: " + cached["title"]}}
                )
                return cached
                
        # Parse PDF
        text = extract_text_from_pdf(content_bytes)
        if len(text) > 15000:
            text = text[:15000]
            
        # Process specific paper for review/feedback
        result = await ai_processor.process_draft_feedback_async(text, file.filename)
        result["hash"] = file_hash
        
        if analyses_collection is not None:
            analyses_collection.insert_one(result.copy())
            
        if users_collection is not None:
            users_collection.update_one(
                {"_id": ObjectId(current_user)},
                {"$addToSet": {"uploaded_papers": result["title"]}}
            )
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error reviewing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/user/profile")
async def get_profile(current_user: str = Depends(require_auth)):
    if users_collection is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    user = users_collection.find_one({"_id": ObjectId(current_user)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "name": user.get("name"),
        "email": user.get("email"),
        "uploaded_papers": user.get("uploaded_papers", [])
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "Research Hub AI Service is Running 🚀"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
