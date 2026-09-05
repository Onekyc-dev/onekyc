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

  if (result.mock) {
    await markUserVerified(session.user.email);
  }

  return Response.json({ started: true });
}
