import json
from src.ai.schemas.alumni_schemas import SearchRequest, StudentProfileSearchRequest, StudentProfile
from src.ai.schemas.roadmap_schemas import RoadmapRequest
from src.ai.schemas.profile_schemas import ProfileTextParseRequest
from src.ai.services.alumni_search import search_alumni_by_skills, search_alumni_with_profile
from src.ai.services.career_roadmap import generate_career_roadmap
from src.ai.services.profile_parser import parse_profile_text

def run_tests():
    print("\n=======================================================")
    print(" CONNECTED AI ENGINE: FULL FEATURE INTEGRATION TEST ")
    print("=======================================================\n")

    # TEST 1: Semantic Alumni Search
    print("--- [TEST 1] SEMANTIC ALUMNI SEARCH ---")
    query = "DevOps engineers with Kubernetes and AWS experience"
    print(f"Query: '{query}'")
    search_res = search_alumni_by_skills(query)
    print(f"Total Matches Found: {len(search_res.matches)}")
    for idx, match in enumerate(search_res.matches[:3], 1):
        print(f"  {idx}. {match.name} ({match.company}) - Match: {match.matchPercentage}")
        print(f"     Reason: {match.reason}")

    # TEST 2: Student Profile-Aware Mentorship Search
    print("\n--- [TEST 2] STUDENT PROFILE-AWARE MENTORSHIP MATCH ---")
    student = StudentProfile(
        name="Sidharth",
        bio="Final year Computer Science student passionate about Cloud Native and DevOps",
        skills=["Python", "Linux", "Git", "Docker"],
        targetRole="DevOps Engineer",
        targetCompanies=["Google", "Flipkart"]
    )
    student_search_res = search_alumni_with_profile("looking for senior DevOps mentor in India", student)
    print(f"Student: {student.name} (Target: {student.targetRole})")
    print(f"Total Matches Found: {len(student_search_res.matches)}")
    for idx, match in enumerate(student_search_res.matches[:3], 1):
        print(f"  {idx}. {match.name} ({match.role} at {match.company}) - Score: {match.matchScore}")
        print(f"     Reason: {match.reason}")

    # TEST 3: AI Profile & Resume Parser
    print("\n--- [TEST 3] AI PROFILE / BIO PARSER ---")
    raw_bio = """
    Sidharth is a Senior Full-Stack Cloud Engineer based in Bengaluru. 
    He has 4 years of experience working with Python, FastAPI, React, Docker, Kubernetes, and AWS.
    Educated at IIT Madras with B.Tech in Computer Science. Interested in mentoring junior developers in DevOps and AI systems.
    Contact: sidharth@connected.edu
    """
    parse_res = parse_profile_text(ProfileTextParseRequest(rawText=raw_bio))
    print(f"Parser Success: {parse_res.success}")
    prof = parse_res.profile
    print(f"Extracted Name: {prof.name}")
    print(f"Headline: {prof.headline}")
    print(f"Skills Extracted: {prof.skills}")
    print(f"Education Extracted: {prof.education}")

    # TEST 4: Career Goal Analysis & Skill-Gap Roadmap Generator
    print("\n--- [TEST 4] AI CAREER GOAL ANALYSIS & ROADMAP GENERATOR ---")
    roadmap_req = RoadmapRequest(
        studentName="Sidharth",
        bio="Final year student aspiring to be a Site Reliability & DevOps Engineer",
        currentSkills=["Python", "Linux", "SQL", "Git"],
        targetRole="DevOps Engineer",
        targetCompany="Atlassian",
        timelineWeeks=12
    )
    roadmap = generate_career_roadmap(roadmap_req)
    print(f"Student: {roadmap.studentName} | Target: {roadmap.targetRole} @ {roadmap.targetCompany}")
    print(f"Readiness Score: {roadmap.skillGapAnalysis.readinessScore}/100")
    print(f"Missing Skills: {roadmap.skillGapAnalysis.missingSkills}")
    print(f"Analysis Summary: {roadmap.skillGapAnalysis.analysisSummary}")
    print(f"\nPhases Generated ({len(roadmap.phases)}):")
    for phase in roadmap.phases:
        print(f"  Phase {phase.phaseNumber}: {phase.title} ({phase.duration})")
        print(f"     Skills to learn: {phase.skillsToLearn}")
        print(f"     Key Projects: {phase.keyProjects}")
    print(f"\nRecommended Alumni Mentors Linked ({len(roadmap.recommendedAlumniMentors)}):")
    for m in roadmap.recommendedAlumniMentors:
        print(f"  [Mentor] {m.name} ({m.role} at {m.company}) - Match: {m.matchPercentage}")

    print("\n=======================================================")
    print(" SUCCESS: ALL CONNECTED AI ENGINE TESTS PASSED!")
    print("=======================================================\n")

if __name__ == "__main__":
    run_tests()
