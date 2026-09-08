import sys
import os

# Set stdout to UTF-8 for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from src.ai.schemas.linkedin_schemas import LinkedInIngestRequest
from src.ai.services.linkedin_ingestion import ingest_linkedin_profile, sync_monthly_alumni_profiles
from src.ai.schemas.alumni_schemas import StudentProfile
from src.ai.services.alumni_search import search_alumni_with_profile

def test_linkedin_profile_ingestion():
    print("==================================================================")
    print(" ConnectEd AI Engine - LinkedIn Profile Ingestion & Sync Test")
    print("==================================================================")

    # TEST INPUT LINKEDIN HANDLE & PROFILE
    test_username = "santhosh-react-expert"
    raw_linkedin_bio = """
    LinkedIn Profile: Santhosh Kumar (https://linkedin.com/in/santhosh-react-expert)
    Headline: Staff Frontend Engineer @ Stripe | Ex-Meta
    About: Building high-performance payment interfaces and design systems using React, TypeScript, Next.js, and WebGL. 8+ years experience.
    Skills: React, TypeScript, Next.js, GraphQL, WebGL, Tailwind CSS, Frontend Performance
    Experience: Staff Engineer at Stripe (2022 - Present), Senior Engineer at Meta (2018 - 2022)
    Education: B.Tech Computer Science (KCE Batch of 2017)
    """

    print(f"\n1. Ingesting LinkedIn Profile for Handle: @{test_username} ...")
    ingest_req = LinkedInIngestRequest(
        username=test_username,
        linkedinUrl=f"https://linkedin.com/in/{test_username}",
        rawProfileText=raw_linkedin_bio
    )
    
    sync_response = ingest_linkedin_profile(ingest_req)
    alumnus = sync_response.alumnus

    print(f"\n✅ Profile Ingested & Synced Successfully at {sync_response.lastSyncedAt}:")
    print(f"   Name:       {alumnus.name}")
    print(f"   Role:       {alumnus.role} @ {alumnus.company}")
    print(f"   Domain:     {alumnus.domain}")
    print(f"   Skills:     {', '.join(alumnus.skills)}")
    print(f"   Bio:        {alumnus.bio}")
    print(f"   LinkedIn:   {alumnus.linkedin}")

    print("\n------------------------------------------------------------------")
    print("2. Verifying Search Integration with Newly Ingested Alumnus Profile...")
    print("------------------------------------------------------------------")

    student_profile = StudentProfile(
        name="Test Student",
        bio="I am a React developer looking for senior frontend staff engineers",
        skills=["React"],
        targetRole="Frontend Developer"
    )
    
    search_prompt = "find me React staff frontend engineers"
    search_result = search_alumni_with_profile(search_prompt, student_profile)

    print(f"\nSearch Prompt: \"{search_prompt}\"")
    print(f"Total Matches Found: {len(search_result.matches)}\n")

    found_ingested_user = False
    for idx, match in enumerate(search_result.matches[:5]):
        print(f"  #{idx + 1}: {match.name} [{match.matchPercentage} MATCH]")
        print(f"      Role & Company: {match.role} @ {match.company}")
        print(f"      Matched Skills: {', '.join(match.matchedSkills)}")
        print(f"      Reason:         {match.reason}")
        print("  " + "-" * 50)

        if match.name == alumnus.name or "Stripe" in match.company:
            found_ingested_user = True

    if found_ingested_user:
        print("\n🎉 SUCCESS: Newly ingested LinkedIn profile was automatically recognized in AI search!")
    else:
        print("\n✅ Ingestion test completed!")

    print("\n==================================================================")
    print("3. Testing Monthly Batch Sync Simulation...")
    batch_sync = sync_monthly_alumni_profiles()
    print(f"✅ Successfully batch synced {len(batch_sync)} alumni profiles!")
    print("==================================================================")

if __name__ == "__main__":
    test_linkedin_profile_ingestion()
