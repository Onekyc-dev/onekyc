// ============================================================
// MOCK DIDIT INTEGRATION — replace the internals of these two
// functions with real calls to Didit's API once you're ready.
// You already have a Didit API key; it goes in DIDIT_API_KEY.
//
// Until then, both functions simulate Didit's behavior with a
// short delay and a randomized-but-mostly-successful outcome,
// so the rest of the app (screens, redirects, session handling)
// can be built and tested without a live Didit connection.
// ============================================================

const MOCK_MODE = !process.env.DIDIT_API_KEY;

// Full document + liveness KYC — used once, at sign-up.
export async function startDiditKyc({ userId }) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    return { diditSessionId: `mock_kyc_${userId}`, mock: true };
  }

  // TODO: real Didit call, e.g.:
  // const res = await fetch("https://api.didit.me/v1/kyc/sessions", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.DIDIT_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ userId }),
  // });
  // return res.json();
  throw new Error("Real Didit KYC integration not wired up yet.");
}

// Liveness-only check — used every time a dApp requests verification.
export async function runLivenessCheck({ userId }) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 1800));
    // Simulate an occasional failure so the fail-state screen is testable.
    const passed = Math.random() > 0.15;
    return { passed, mock: true, reason: passed ? null : "face_mismatch" };
  }

  // TODO: real Didit liveness call goes here.
  throw new Error("Real Didit liveness integration not wired up yet.");
}
