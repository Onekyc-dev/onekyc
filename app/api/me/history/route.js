import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getVerificationHistory } from "../../../../lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  const history = await getVerificationHistory(session.user.email);
  return Response.json({ history });
}
