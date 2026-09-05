import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { getVerificationSession, addVerificationHistory } from "../../../../../lib/db";
import { signResult } from "../../../../../lib/signResult";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const vSession = await getVerificationSession(params.sessionId);
  if (!vSession || vSession.status !== "liveness_passed") {
    return Response.json({ error: "Session not verified" }, { status: 400 });
  }

  await addVerificationHistory(session.user.email, vSession.dappName);

  const token = signResult({
    verified: true,
    dapp: vSession.dappName,
    timestamp: new Date().toISOString(),
  });

  const redirectUrl = `${vSession.redirectUri}?verified=true&token=${token}`;

  return Response.json({ dappName: vSession.dappName, redirectUrl });
}
