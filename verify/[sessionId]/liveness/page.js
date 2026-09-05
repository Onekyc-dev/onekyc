"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const FAIL_MESSAGES = {
  face_mismatch: "Your face didn't match your document photo. Make sure your face is centered and well-lit.",
  system_error: "Something went wrong on our end, not yours. Please try again in a moment.",
  default: "We couldn't confirm it was you. Please try again.",
};

export default function LivenessPage() {
  const { status } = useSession();
  const router = useRouter();
  const { sessionId } = useParams();
  const [state, setState] = useState("checking"); // checking | failed
  const [failReason, setFailReason] = useState(null);
  const [attempts, setAttempts] = useState(1);

  useEffect(() => {
    if (status !== "authenticated") return;
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function runCheck() {
    setState("checking");
    const res = await fetch(`/api/verify/liveness/${sessionId}`, { method: "POST" });
    const data = await res.json();

    if (data.passed) {
      router.push(`/verify/${sessionId}/result`);
    } else {
      setFailReason(data.reason ?? "default");
      setState("failed");
    }
  }

  if (status === "loading") return null;

  return (
    <main className="screen">
      <div className="panel">
        {state === "checking" ? (
          <>
            <div className="spinner" />
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Liveness check</p>
            <p className="sub">Hold still — confirming it&apos;s really you.</p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Verification failed</p>
            <p className="sub" style={{ marginBottom: 20 }}>
              {FAIL_MESSAGES[failReason] ?? FAIL_MESSAGES.default}
            </p>
            <button
              className="btn btn-gold"
              onClick={() => {
                setAttempts((a) => a + 1);
                runCheck();
              }}
            >
              Try again
            </button>
            <p className="muted" style={{ marginTop: 10 }}>Attempt {attempts} of 3</p>
          </>
        )}
      </div>
    </main>
  );
}
