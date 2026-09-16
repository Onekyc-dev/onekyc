"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPromptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  async function handleStartKyc() {
    setStarting(true);
    const res = await fetch("/api/kyc/start", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else router.push("/kyc-processing");
  }

  return (
    <main className="screen">
      <div className="gold-art" aria-hidden="true">
        <div className="globe" />
        <span className="wave" /><span className="wave" /><span className="wave" /><span className="wave" />
      </div>

      <div className="screen-inner auth-card">
        <button className="auth-back" aria-label="Go back" onClick={() => router.push("/")}>←</button>
        <div className="auth-top" style={{ justifyContent: "flex-start", marginBottom: 26 }}>
          <img className="auth-logo" src="/logo-mark.png" alt="OneKYC" />
        </div>
        <p className="eyebrow" style={{ textAlign: "left" }}>Identity verification</p>
        <h1>One more step.</h1>
        <p className="lead">Your account is ready. Complete one identity check and your OneKYC proof is created.</p>

        <div className="verify-target">
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Signed in as</p>
          <p className="muted" style={{ wordBreak: "break-all" }}>{session.user.email}</p>
        </div>

        <button className="btn btn-gold" onClick={handleStartKyc} disabled={starting}>
          {starting ? "Starting verification…" : "Verify my identity"}
          {!starting && <span className="btn-arrow">→</span>}
        </button>
        <p className="muted" style={{ textAlign: "center", marginTop: 13 }}>About 2 minutes · ID document + quick face scan</p>
      </div>
    </main>
  );
}
