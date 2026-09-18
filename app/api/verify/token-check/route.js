import { verifyResult } from "../../../../lib/signResult";

// Public API — any registered dApp's backend calls this server-to-server
// to confirm a token it received genuinely came from OneKYC and hasn't
// been tampered with.
export async function POST(request) {
  const { token } = await request.json();
  const payload = verifyResult(token);

  if (!payload) {
    return Response.json({ valid: false }, { status: 400 });
  }

  return Response.json({ valid: true, payload });
}
