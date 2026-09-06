import crypto from "crypto";
import { markUserVerified } from "../../../../lib/db";

function isSignatureValid(rawBody, signatureHeader) {
  if (!process.env.DIDIT_WEBHOOK_SECRET) return false;
  if (!signatureHeader) return false;

  const expected = crypto
    .createHmac("sha256", process.env.DIDIT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!isSignatureValid(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const email = payload.vendor_data;
  const status = payload.status;

  if (status === "Approved" && email) {
    await markUserVerified(email);
  }

  return Response.json({ received: true });
}
