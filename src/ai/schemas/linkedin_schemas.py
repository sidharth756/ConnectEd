from pydantic import BaseModel, Field
from typing import List, Optional

class LinkedInIngestRequest(BaseModel):
    username: str = Field(..., description="LinkedIn username / handle", example="aravind-krishnamurthy")
    linkedinUrl: Optional[str] = Field(default=None, description="Full LinkedIn profile URL")
    rawProfileText: Optional[str] = Field(default=None, description="Raw text snippet from public LinkedIn profile")

class ParsedLinkedInProfile(BaseModel):
    id: str = Field(..., description="Unique Alumnus ID")
    username: str = Field(..., description="LinkedIn username")
    name: str = Field(..., description="Alumnus full name")
    role: str = Field(..., description="Current job title")
    company: str = Field(..., description="Current company")
    graduationYear: Optional[int] = Field(default=2022, description="Graduation year")
    location: str = Field(default="India", description="City / Region")
    domain: str = Field(default="Software Engineering", description="Engineering domain")
    skills: List[str] = Field(default_factory=list, description="Extracted technical skills")
    bio: str = Field(default="", description="Summary / headline")
    linkedin: str = Field(..., description="LinkedIn profile URL")
    email: Optional[str] = Field(default=None, description="Contact email")
    experienceYears: Optional[int] = Field(default=3, description="Years of experience")
    willingToMentor: bool = Field(default=True, description="Mentorship status")

class LinkedInIngestResponse(BaseModel):
    status: str = Field(default="synced", description="Ingestion status: 'synced' or 'updated'")
    lastSyncedAt: str = Field(..., description="ISO Timestamp of sync")
    alumnus: ParsedLinkedInProfile
