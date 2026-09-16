import { createVerificationSession, isDappApproved } from "../../../../lib/db";

export async function POST(request) {
  const { dappName, redirectUri } = await request.json();

  if (!dappName || !redirectUri) {
    return Response.json({ error: "dappName and redirectUri are required" }, { status: 400 });
  }

  const approved = await isDappApproved(dappName, redirectUri);
  if (!approved) {
    return Response.json({ error: "This dApp is not registered with OneKYC" }, { status: 403 });
  }

  const session = await createVerificationSession({ dappName, redirectUri });

  return Response.json({
    sessionId: session.id,
    redirectUrl: `${process.env.NEXTAUTH_URL ?? ""}/verify/${session.id}`,
    expiresAt: session.expiresAt,
  });
}
