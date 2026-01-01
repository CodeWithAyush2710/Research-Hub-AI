from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import os
from dotenv import load_dotenv
from data_loader import DataLoader
from ai_processor import AIProcessor
from llm_config import get_llm

load_dotenv()

# DEBUG: Print API Key status
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    print(f"🔑 Loaded API Key: {api_key[:4]}...{api_key[-4:]} (Length: {len(api_key)})")
else:
    print("❌ No API Key found in environment variables!")

app = FastAPI(title="Research Paper Analyzer AI Service")

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

@app.post("/api/analyze", response_model=List[PaperResponse])
async def analyze_papers(request: AnalyzeRequest):
    """
    Fetch papers from ArXiv and analyze them using AI agents.
    """
    try:
        query = request.query
        print(f"🔍 Received query: {query}")
        
        # 1. Fetch papers
        papers = data_loader.fetch_arxiv_papers(query)
        if not papers:
            return []
            
        # 2. Process papers
        processed_papers = await ai_processor.process_papers_async(papers)
        
        return processed_papers
    except Exception as e:
        print(f"❌ Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
