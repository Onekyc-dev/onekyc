import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getUserByEmail } from "../../../../lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  const user = await getUserByEmail(session.user.email);
  return Response.json({ history: user?.history ?? [] });
}
