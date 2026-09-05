import crypto from "crypto";

// Produces a signed, tamper-evident payload a dApp can trust came from
// OneKYC and hasn't been altered in transit. This is a minimal HMAC
// scheme — fine to start with, but consider moving to signed JWTs
// (e.g. via `jose`) once you have multiple integrators depending on it.
export function signResult(payload) {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  const encoded = Buffer.from(data).toString("base64url");
  return `${encoded}.${signature}`;
}
