import { markUserVerified } from "../../../../lib/db";

export async function POST(request) {
  const payload = await request.json();
  const { email, status } = payload;

  if (status === "approved" && email) {
    await markUserVerified(email);
  }

  return Response.json({ received: true });
}
