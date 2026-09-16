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
      <div className="gold-art" aria-hidden="true">
        <span className="wave" /><span className="wave" /><span className="wave" />
      </div>
      <div className="screen-inner auth-card" style={{ textAlign: "center" }}>
        {state === "processing" && (
          <>
            <div className="processing-mark" />
            <p className="eyebrow">Secure verification</p>
            <h1>Checking your identity</h1>
            <p className="lead">Didit is reviewing your documents and completing the identity check.</p>
            <div className="spinner" />
            <p className="muted" style={{ marginTop: 12 }}>Keep this page open. We&apos;ll take you to your OneKYC dashboard when it&apos;s confirmed.</p>
          </>
        )}

        {state === "waiting" && (
          <>
            <div className="processing-mark" />
            <p className="eyebrow">Still processing</p>
            <h1>This is taking a little longer.</h1>
            <p className="lead">Your verification is still being checked. You can return to the dashboard and we&apos;ll keep the status updated.</p>
            <button className="btn btn-ghost" onClick={() => router.push("/dashboard")}>Go to my dashboard</button>
          </>
        )}

        {state === "verified" && (
          <>
            <div className="processing-mark" style={{ borderColor: "rgba(69,229,138,.4)", background: "radial-gradient(circle, rgba(69,229,138,.14), transparent 66%)" }}>
              <span style={{ color: "var(--success)", fontSize: 32 }}>✓</span>
            </div>
            <p className="eyebrow" style={{ color: "var(--success)" }}>Verification complete</p>
            <h1>You&apos;re verified.</h1>
            <p className="lead">Your OneKYC identity is confirmed. You won&apos;t need to repeat this step for every supported app.</p>
            <button className="btn btn-gold" onClick={() => router.push("/dashboard")}>Go to my dashboard <span className="btn-arrow">→</span></button>
          </>
        )}
      </div>
    </main>
  );
}
