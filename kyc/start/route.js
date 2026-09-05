import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { startDiditKyc } from "../../../../lib/didit";
import { markUserVerified } from "../../../../lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const result = await startDiditKyc({ userId: session.user.id });

  // In mock mode we simulate an immediate pass so the flow is testable
  // end-to-end. Once real Didit is wired in, this becomes a webhook
  // (see /api/kyc/webhook) instead of an immediate mark-as-verified.
  if (result.mock) {
    await markUserVerified(session.user.email);
  }

  return Response.json({ started: true });
}
