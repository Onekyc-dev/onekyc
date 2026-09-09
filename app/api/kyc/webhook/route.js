import crypto from "crypto";
import { markUserVerified, updateVerificationStatus } from "../../../../lib/db";
import { sendVerificationResultEmail } from "../../../../lib/email";

function stripSecretPrefix(secret) {
  return secret.startsWith("whsec_") ? secret.slice(6) : secret;
}

function isSignatureValid({ timestamp, sessionId, status, webhookType, signatureHeader }) {
  if (!process.env.DIDIT_WEBHOOK_SECRET) return false;
  if (!signatureHeader || !timestamp) return false;

  // Reject stale/replayed deliveries older than 5 minutes.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) return false;

  const secret = stripSecretPrefix(process.env.DIDIT_WEBHOOK_SECRET);
  const signedString = `${timestamp}:${sessionId}:${status}:${webhookType}`;
  const expected = crypto.createHmac("sha256", secret).update(signedString).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
  } catch {
    return false;
  }
}

function toInternalStatus(diditStatus) {
  const s = (diditStatus ?? "").toUpperCase();
  if (s === "APPROVED") return "verified";
  if (s === "DECLINED") return "declined";
  if (s === "IN_REVIEW") return "in_review";
  return "none";
}

export async function POST(request) {
  const rawBody = await request.text();
  const payload = JSON.parse(rawBody);

  const timestamp = request.headers.get("x-timestamp");
  const signature = request.headers.get("x-signature-simple");
  const webhookType = payload.event;
  const sessionId = payload.data?.session_id;
  const status = payload.data?.status;
  const email = payload.data?.vendor_data;

  // TEMP DEBUG — remove once signature verification is confirmed working.
  console.log("Webhook debug:", {
    allHeaders: Object.fromEntries(request.headers.entries()),
    payloadTopLevelKeys: Object.keys(payload),
    payloadDataKeys: payload.data ? Object.keys(payload.data) : null,
    timestamp,
    signatureReceived: signature,
    webhookType,
    sessionId,
    status,
    hasEmail: !!email,
  });

  const valid = isSignatureValid({ timestamp, sessionId, status, webhookType, signatureHeader: signature });

  if (!valid) {
    console.log("Signature mismatch — rejecting.");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }


  if (!email) return Response.json({ received: true });

  const upperStatus = status?.toUpperCase();

  if (upperStatus === "APPROVED") {
    await markUserVerified(email);
    await sendVerificationResultEmail(email, true);
  } else if (upperStatus === "DECLINED") {
    await updateVerificationStatus(email, toInternalStatus(status));
    await sendVerificationResultEmail(email, false);
  } else {
    // In review / other intermediate states — update status, no email yet.
    await updateVerificationStatus(email, toInternalStatus(status));
  }

  return Response.json({ received: true });
}
