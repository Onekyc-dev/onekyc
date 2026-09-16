import { Pool } from "pg";
import crypto from "crypto";

let pool;
export function getPool() {
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
    verificationStatus: row.verification_status,
        flaggedDuplicate: row.flagged_duplicate,
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
    `update users set verified = true, verified_at = now(), verification_status = 'verified'
     where email = $1 returning *`,
    [email]
  );
  return rowToUser(rows[0]);
}

export async function updateVerificationStatus(email, status) {
  const { rows } = await getPool().query(
    "update users set verification_status = $2 where email = $1 returning *",
    [email, status]
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

export async function isDappApproved(dappName, redirectUri) {
  const { rows } = await getPool().query(
    "select 1 from approved_dapps where dapp_name = $1 and redirect_uri = $2",
    [dappName, redirectUri]
  );
  return rows.length > 0;
}

export async function updateVerificationSession(id, updates) {
  const { rows } = await getPool().query(
    "update verification_sessions set status = $2 where id = $1 returning *",
    [id, updates.status]
  );
  return rowToSession(rows[0]);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function hashOtp(email, code) {
  return crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(`${normalizeEmail(email)}:${code}`)
    .digest("hex");
}

export async function createEmailOtp(email) {
  const normalizedEmail = normalizeEmail(email);

  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = hashOtp(normalizedEmail, code);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await getPool().query(
    `update email_otp_challenges
     set consumed = true
     where email = $1
       and consumed = false`,
    [normalizedEmail]
  );

  await getPool().query(
    `insert into email_otp_challenges
      (email, code_hash, expires_at)
     values ($1, $2, $3)`,
    [normalizedEmail, codeHash, expiresAt]
  );

  return code;
}

export async function verifyEmailOtp(email, code) {
  const normalizedEmail = normalizeEmail(email);
  const cleanCode = String(code).replace(/\D/g, "");

  if (!/^\d{6}$/.test(cleanCode)) {
    return { success: false, reason: "invalid" };
  }

  const { rows } = await getPool().query(
    `select *
     from email_otp_challenges
     where email = $1
       and consumed = false
     order by created_at desc
     limit 1`,
    [normalizedEmail]
  );

  const challenge = rows[0];

  if (!challenge) {
    return { success: false, reason: "missing" };
  }

  if (new Date(challenge.expires_at) < new Date()) {
    await getPool().query(
      `update email_otp_challenges
       set consumed = true
       where id = $1`,
      [challenge.id]
    );

    return { success: false, reason: "expired" };
  }

  if (challenge.attempts >= 5) {
    return { success: false, reason: "too_many_attempts" };
  }

  const expectedHash = hashOtp(normalizedEmail, cleanCode);

  if (
    !crypto.timingSafeEqual(
      Buffer.from(expectedHash, "hex"),
      Buffer.from(challenge.code_hash, "hex")
    )
  ) {
    await getPool().query(
      `update email_otp_challenges
       set attempts = attempts + 1
       where id = $1`,
      [challenge.id]
    );

    return { success: false, reason: "invalid" };
  }

  await getPool().query(
    `update email_otp_challenges
     set consumed = true
     where id = $1`,
    [challenge.id]
  );

  return { success: true };
}
