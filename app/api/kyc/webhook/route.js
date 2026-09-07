import crypto from "crypto";
import { markUserVerified, updateVerificationStatus } from "../../../../lib/db";

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

// Maps Didit's status strings to our own simplified states.
function toInternalStatus(diditStatus) {
  if (diditStatus === "Approved") return "verified";
  if (diditStatus === "Declined") return "declined";
  if (diditStatus === "In Review") return "in_review";
  return "none";
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

  if (!email) return Response.json({ received: true });

  if (status === "Approved") {
    await markUserVerified(email);
  } else {
    await updateVerificationStatus(email, toInternalStatus(status));
  }

  return Response.json({ received: true });
}
