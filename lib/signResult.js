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

// The counterpart to signResult — a dApp's backend calls this on the
// token it receives to confirm it genuinely came from OneKYC and
// hasn't been tampered with. Returns the original payload if valid,
// or null if the signature doesn't match.
export function verifyResult(token) {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
    const data = Buffer.from(encoded, "base64url").toString();
    const expected = crypto.createHmac("sha256", secret).update(data).digest("hex");

    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    return valid ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function verifyResult(token) {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
    const data = Buffer.from(encoded, "base64url").toString();
    const expected = crypto.createHmac("sha256", secret).update(data).digest("hex");
    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    return valid ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
