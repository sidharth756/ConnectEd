from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from src.ai.schemas.alumni_schemas import SearchRequest, StudentProfileSearchRequest, AlumniSearchResult
from src.ai.schemas.linkedin_schemas import LinkedInIngestRequest, LinkedInIngestResponse
from src.ai.services.alumni_search import search_alumni_by_skills, search_alumni_with_profile
from src.ai.services.linkedin_ingestion import ingest_linkedin_profile, parse_linkedin_pdf_bytes, sync_monthly_alumni_profiles

app = FastAPI(
    title="ConnectEd AI Service",
    description="Python AI Engine powering semantic alumni search, LinkedIn profile ingestion, monthly sync, and student mentorship matching.",
    version="1.0.0"
)

# Enable CORS for Node.js backend and React frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "ConnectEd Python AI Engine",
        "version": "1.0.0"
    }

@app.post("/api/ai/alumni-search", response_model=AlumniSearchResult)
def api_search_alumni(request: SearchRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty")
    return search_alumni_by_skills(request.query)

@app.post("/api/ai/alumni-search-with-profile", response_model=AlumniSearchResult)
def api_search_alumni_with_profile(request: StudentProfileSearchRequest):
    return search_alumni_with_profile(request.userPrompt, request.studentProfile)

@app.post("/api/ai/ingest-linkedin", response_model=LinkedInIngestResponse)
def api_ingest_linkedin(request: LinkedInIngestRequest):
    if not request.username.strip():
        raise HTTPException(status_code=400, detail="LinkedIn username is required")
    return ingest_linkedin_profile(request)

@app.post("/api/ai/ingest-linkedin-pdf", response_model=LinkedInIngestResponse)
async def api_ingest_linkedin_pdf(username: str = Form(...), file: UploadFile = File(...)):
    """Extracts text from uploaded LinkedIn PDF resume and parses with Gemini LLM."""
    contents = await file.read()
    return parse_linkedin_pdf_bytes(contents, username)

@app.post("/api/ai/sync-linkedin-batch", response_model=List[LinkedInIngestResponse])
def api_sync_linkedin_batch():
    """Monthly background trigger endpoint to re-sync all registered alumni profiles."""
    return sync_monthly_alumni_profiles()
