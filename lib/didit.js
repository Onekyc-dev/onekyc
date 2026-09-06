const MOCK_MODE = !process.env.DIDIT_API_KEY;
const DIDIT_BASE = "https://verification.didit.me";

export async function startDiditKyc({ email }) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    return { url: null, mock: true };
  }

  const res = await fetch(`${DIDIT_BASE}/v3/session/`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.DIDIT_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflow_id: process.env.DIDIT_WORKFLOW_ID,
      vendor_data: email,
      callback: `${process.env.NEXTAUTH_URL}/kyc-processing`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Didit session creation failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return { url: data.url ?? data.verification_url, mock: false };
}

export async function runLivenessCheck({ imageBase64 }) {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 1200));
    const passed = Math.random() > 0.15;
    return { passed, mock: true, reason: passed ? null : "face_mismatch" };
  }

  const buffer = Buffer.from(imageBase64.split(",").pop(), "base64");
  const form = new FormData();
  form.append("image", new Blob([buffer], { type: "image/jpeg" }), "selfie.jpg");

  const res = await fetch(`${DIDIT_BASE}/v3/passive-liveness/`, {
    method: "POST",
    headers: { "x-api-key": process.env.DIDIT_API_KEY },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    return { passed: false, reason: "system_error", detail: text };
  }

  const data = await res.json();
  const passed = data.status === "Approved";
  return { passed, reason: passed ? null : "face_mismatch" };
}
