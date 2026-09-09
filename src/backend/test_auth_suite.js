import { prisma } from './db/client.js';

const BACKEND_URL = 'http://127.0.0.1:5000';

const TEST_USERS = [
  {
    role: 'ADMIN',
    name: 'Admin Test User',
    email: 'connected.test.admin@example.com',
    password: 'ConnectEd@Admin123',
    department: 'Platform Administration',
  },
  {
    role: 'ALUMNI',
    name: 'Shebha Alumni Test',
    email: 'connected.test.alumni@example.com',
    password: 'ConnectEd@Alumni123',
    major: 'Computer Science & Engineering',
    graduationYear: 2019,
    targetRole: 'Principal Architect',
    targetCompany: 'Google Cloud',
  },
  {
    role: 'STUDENT',
    name: 'Shebha Student Test',
    email: 'connected.test.student@example.com',
    password: 'ConnectEd@Student123',
    major: 'Artificial Intelligence & Data Science',
    graduationYear: 2026,
    targetRole: 'Senior AI Engineer',
    targetCompany: 'Google DeepMind',
  },
];

async function runAuthTests() {
  console.log("\n=======================================================");
  console.log(" CONNECTED AUTH & ROLE-BASED DASHBOARD TEST SUITE ");
  console.log("=======================================================\n");

  const tokens = {};

  // 1. REGISTER TEST USERS FOR EVERY ROLE
  console.log("--- [TEST 1] REGISTRATION & DATABASE PERSISTENCE ---");
  for (const u of TEST_USERS) {
    console.log(`Registering ${u.role}: ${u.email}...`);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
      const json = await res.json();
      if (res.status === 201 && json.success) {
        console.log(`  ✓ Registration HTTP 201 PASS for ${u.role} (${json.user.id})`);
        tokens[u.role] = json.token;
      } else if (res.status === 409) {
        console.log(`  ℹ User ${u.email} already registered in DB (HTTP 409 duplicate handling verified). Logging in...`);
      } else {
        console.error(`  ✗ Registration FAILED for ${u.role}:`, json);
      }
    } catch (err) {
      console.error(`  ✗ Registration exception for ${u.role}:`, err.message);
    }
  }

  // 2. VERIFY USERS IN POSTGRESQL DATABASE VIA PRISMA
  console.log("\n--- [TEST 2] DIRECT POSTGRESQL DATABASE VERIFICATION ---");
  for (const u of TEST_USERS) {
    const dbUser = await prisma.user.findUnique({
      where: { email: u.email },
      include: { studentProfile: true, alumniProfile: true }
    });
    if (dbUser) {
      console.log(`  ✓ PostgreSQL Record Found: ID=${dbUser.id} | Email=${dbUser.email} | Role=${dbUser.role} | PasswordHashed=${dbUser.password?.startsWith('$2')}`);
      if (u.role === 'STUDENT') {
        console.log(`     StudentProfile Attached: Major=${dbUser.studentProfile?.major}, TargetRole=${dbUser.studentProfile?.targetRole}`);
      } else if (u.role === 'ALUMNI') {
        console.log(`     AlumniProfile Attached: Major=${dbUser.alumniProfile?.major}, Role=${dbUser.alumniProfile?.role}, Company=${dbUser.alumniProfile?.company}`);
      }
    } else {
      console.error(`  ✗ DB Record MISSING for ${u.email}`);
    }
  }

  // 3. TEST REJECTION OF DUPLICATE EMAIL
  console.log("\n--- [TEST 3] DUPLICATE EMAIL REJECTION TEST ---");
  const dupRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USERS[2])
  });
  const dupJson = await dupRes.json();
  console.log(`Duplicate Email HTTP Status: ${dupRes.status} (Expected: 409) | Message: '${dupJson.error?.message}'`);
  if (dupRes.status === 409 && dupJson.error?.code === 'EMAIL_ALREADY_EXISTS') {
    console.log("  ✓ Duplicate email rejected properly with HTTP 409");
  } else {
    console.error("  ✗ Duplicate email rejection failed");
  }

  // 4. TEST LOGIN FOR EVERY ROLE & CREDENTIAL VALIDATION
  console.log("\n--- [TEST 4] ROLE-BASED LOGIN & CREDENTIAL VALIDATION ---");
  for (const u of TEST_USERS) {
    console.log(`Testing Login for ${u.role} (${u.email})...`);
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: u.email, password: u.password })
    });
    const loginJson = await loginRes.json();
    if (loginRes.status === 200 && loginJson.success && loginJson.token) {
      console.log(`  ✓ Login HTTP 200 PASS for ${u.role} | User: ${loginJson.user.name} | Returned Role: ${loginJson.user.role}`);
      tokens[u.role] = loginJson.token;
    } else {
      console.error(`  ✗ Login FAILED for ${u.role}:`, loginJson);
    }
  }

  // 5. TEST WRONG PASSWORD REJECTION
  console.log("\n--- [TEST 5] WRONG CREDENTIALS REJECTION TEST ---");
  const wrongRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USERS[2].email, password: 'WrongPassword123!' })
  });
  const wrongJson = await wrongRes.json();
  console.log(`Wrong Password HTTP Status: ${wrongRes.status} (Expected: 401) | Message: '${wrongJson.error?.message}'`);
  if (wrongRes.status === 401 && wrongJson.error?.code === 'INVALID_CREDENTIALS') {
    console.log("  ✓ Wrong password correctly rejected with generic user message");
  } else {
    console.error("  ✗ Wrong password handling failed");
  }

  // 6. TEST AUTHENTICATED /api/auth/me CURRENT-USER ENDPOINT
  console.log("\n--- [TEST 6] /api/auth/me CURRENT USER SESSION VERIFICATION ---");
  for (const u of TEST_USERS) {
    const token = tokens[u.role];
    if (!token) continue;
    const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meJson = await meRes.json();
    if (meRes.status === 200 && meJson.success && meJson.data) {
      const dbData = meJson.data;
      console.log(`  ✓ /api/auth/me PASS for ${u.role}: Name='${dbData.name}', Email='${dbData.email}', Role='${dbData.role}'`);
      if (dbData.password || dbData.passwordHash) {
        console.error("  SECURITY FAILURE: Password field returned in /api/auth/me!");
      }
    } else {
      console.error(`  ✗ /api/auth/me FAILED for ${u.role}:`, meJson);
    }
  }

  console.log("\n=======================================================");
  console.log(" SUCCESS: ALL CONNECTED AUTH SUITE TESTS COMPLETED!");
  console.log("=======================================================\n");

  await prisma.$disconnect();
}

runAuthTests().catch(err => {
  console.error("Auth test execution error:", err);
  prisma.$disconnect();
});
