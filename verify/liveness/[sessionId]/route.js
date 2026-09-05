import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { runLivenessCheck } from "../../../../../lib/didit";
import { updateVerificationSession } from "../../../../../lib/db";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const result = await runLivenessCheck({ userId: session.user.id });

  await updateVerificationSession(params.sessionId, {
    status: result.passed ? "liveness_passed" : "failed",
  });

  return Response.json(result);
}
