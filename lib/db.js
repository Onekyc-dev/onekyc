import { Pool } from "pg";

let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set.");
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateOneKycId() {
  const part = () => Math.random().toString(16).slice(2, 6).toUpperCase();
  return `OKYC-${part()}-${part()}`;
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    oneKycId: row.one_kyc_id,
    email: row.email,
    name: row.name,
    verified: row.verified,
    verifiedAt: row.verified_at,
  };
}

export async function getUserByEmail(email) {
  const { rows } = await getPool().query(
    "select * from users where email = $1",
    [email]
  );
  return rowToUser(rows[0]);
}

export async function createUser({ email, name }) {
  const id = uid("user");
  const oneKycId = generateOneKycId();
  const { rows } = await getPool().query(
    `insert into users (id, email, one_kyc_id, name, verified)
     values ($1, $2, $3, $4, false)
     on conflict (email) do update set name = excluded.name
     returning *`,
    [id, email, oneKycId, name]
  );
  return rowToUser(rows[0]);
}

export async function markUserVerified(email) {
  const { rows } = await getPool().query(
    `update users set verified = true, verified_at = now()
     where email = $1 returning *`,
    [email]
  );
  return rowToUser(rows[0]);
}

export async function addVerificationHistory(email, dappName) {
  await getPool().query(
    "insert into verification_history (user_email, dapp_name) values ($1, $2)",
    [email, dappName]
  );
}

export async function getVerificationHistory(email) {
  const { rows } = await getPool().query(
    "select dapp_name, created_at from verification_history where user_email = $1 order by created_at desc",
    [email]
  );
  return rows.map((r) => ({ dappName: r.dapp_name, timestamp: r.created_at }));
}

function rowToSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    dappName: row.dapp_name,
    redirectUri: row.redirect_uri,
    status: row.status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

export async function createVerificationSession({ dappName, redirectUri }) {
  const id = uid("vs");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const { rows } = await getPool().query(
    `insert into verification_sessions (id, dapp_name, redirect_uri, status, expires_at)
     values ($1, $2, $3, 'pending', $4)
     returning *`,
    [id, dappName, redirectUri, expiresAt]
  );
  return rowToSession(rows[0]);
}

export async function getVerificationSession(id) {
  const { rows } = await getPool().query(
    "select * from verification_sessions where id = $1",
    [id]
  );
  const session = rowToSession(rows[0]);
  if (!session) return null;
  if (new Date() > new Date(session.expiresAt) && session.status === "pending") {
    await getPool().query(
      "update verification_sessions set status = 'expired' where id = $1",
      [id]
    );
    session.status = "expired";
  }
  return session;
}

export async function updateVerificationSession(id, updates) {
  const { rows } = await getPool().query(
    "update verification_sessions set status = $2 where id = $1 returning *",
    [id, updates.status]
  );
  return rowToSession(rows[0]);
}
