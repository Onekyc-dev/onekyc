import { markUserVerified } from "../../../../lib/db";

// TODO: once real Didit is wired in, point Didit's webhook config at
// this route. Verify the request signature using DIDIT_WEBHOOK_SECRET
// before trusting the payload — don't mark anyone verified without that
// check in production.
export async function POST(request) {
  const payload = await request.json();

  // Expected shape depends on Didit's actual webhook format — adjust
  // once you have their docs in front of you.
  const { email, status } = payload;

  if (status === "approved" && email) {
    await markUserVerified(email);
  }

  return Response.json({ received: true });
}
