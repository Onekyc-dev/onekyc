import { createVerificationSession } from "../../../../lib/db";

// A dApp calls this (server-to-server) to start a verification request,
// then redirects its user to the returned `redirectUrl`.
//
// TODO: before production, only accept requests from dApps registered
// in advance (an allowlist of dappName -> approved redirectUri), so a
// phishing site can't register an arbitrary callback and receive results
// meant for someone else. Right now this trusts whatever is posted.
export async function POST(request) {
  const { dappName, redirectUri } = await request.json();

  if (!dappName || !redirectUri) {
    return Response.json(
      { error: "dappName and redirectUri are required" },
      { status: 400 }
    );
  }

  const session = await createVerificationSession({ dappName, redirectUri });

  return Response.json({
    sessionId: session.id,
    redirectUrl: `${process.env.NEXTAUTH_URL ?? ""}/verify/${session.id}`,
    expiresAt: session.expiresAt,
  });
}
