import { getVerificationSession } from "../../../../../lib/db";

export async function GET(request, { params }) {
  const session = await getVerificationSession(params.sessionId);
  if (!session) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(session);
}
