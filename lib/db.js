// ============================================================
// MOCK DATABASE — replace this file's internals once you've
// created a Supabase or Neon project and have a DATABASE_URL.
//
// Every function below is written the way a real DB call would
// look (async, returns plain objects) so swapping the internals
// for real SQL/Supabase client calls later doesn't require
// touching any of the code that calls these functions.
//
// Right now everything lives in memory, which means it resets
// every time the server restarts/redeploys. That's expected —
// this is a stand-in, not a real database.
// ============================================================

const users = new Map(); // email -> user record
const verificationSessions = new Map(); // sessionId -> session record

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function generateOneKycId() {
  const part = () => Math.random().toString(16).slice(2, 6).toUpperCase();
  return `OKYC-${part()}-${part()}`;
}

export async function getUserByEmail(email) {
  return users.get(email) ?? null;
}

export async function createUser({ email, name }) {
  const user = {
    id: uid("user"),
    oneKycId: generateOneKycId(),
    email,
    name,
    verified: false,
    verifiedAt: null,
    history: [], // { dappName, timestamp }
  };
  users.set(email, user);
  return user;
}

export async function markUserVerified(email) {
  const user = users.get(email);
  if (!user) return null;
  user.verified = true;
  user.verifiedAt = new Date().toISOString();
  users.set(email, user);
  return user;
}

export async function addVerificationHistory(email, dappName) {
  const user = users.get(email);
  if (!user) return null;
  user.history.unshift({ dappName, timestamp: new Date().toISOString() });
  users.set(email, user);
  return user;
}

// --- Verification sessions (a dApp asking OneKYC to check someone) ---

export async function createVerificationSession({ dappName, redirectUri }) {
  const session = {
    id: uid("vs"),
    dappName,
    redirectUri,
    status: "pending", // pending -> liveness_passed | failed | expired
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  verificationSessions.set(session.id, session);
  return session;
}

export async function getVerificationSession(id) {
  const session = verificationSessions.get(id);
  if (!session) return null;
  if (Date.now() > session.expiresAt && session.status === "pending") {
    session.status = "expired";
  }
  return session;
}

export async function updateVerificationSession(id, updates) {
  const session = verificationSessions.get(id);
  if (!session) return null;
  Object.assign(session, updates);
  verificationSessions.set(id, session);
  return session;
}
