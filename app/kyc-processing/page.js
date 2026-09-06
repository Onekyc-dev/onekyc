"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 2000;

export default function KycProcessingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [state, setState] = useState("processing");
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.verified) {
      setState("verified");
      return;
    }

    const timer = setInterval(async () => {
      attemptsRef.current += 1;
      await update();
      if (attemptsRef.current >= MAX_POLLS) {
        clearInterval(timer);
        setState((s) => (s === "verified" ? s : "waiting"));
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [status, update]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session?.user?.verified) setState("verified");
  }, [session?.user?.verified]);

  if (status === "loading") return null;

  return (
    <main className="screen">
      <div className="panel">
        {state === "processing" && (
          <>
            <div className="spinner" />
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
              Verifying your identity
            </p>
            <p className="sub">Didit is checking your documents. This takes a moment.</p>
          </>
        )}

        {state === "waiting" && (
          <>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
              Still processing
            </p>
            <p className="sub" style={{ marginBottom: 20 }}>
              This is taking longer than usual. You can check back in a
              moment — we&apos;ll email you once it&apos;s confirmed.
            </p>
            <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>
              Go to my dashboard
            </button>
          </>
        )}

        {state === "verified" && (
          <>
            <div className="badge success" style={{ justifyContent: "center", marginBottom: 16 }}>
              ✓ You&apos;re verified
            </div>
            <p className="sub" style={{ marginBottom: 20 }}>
              Your identity is confirmed. You won&apos;t need to redo this step again.
            </p>
            <button className="btn btn-gold" onClick={() => router.push("/dashboard")}>
              Go to my dashboard
            </button>
          </>
        )}
      </div>
    </main>
  );
}
