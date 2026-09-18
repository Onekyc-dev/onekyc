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
