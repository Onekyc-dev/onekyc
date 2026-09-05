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
    await fetch("/api/kyc/start", { method: "POST" });
    router.push("/kyc-processing");
  }

  return (
    <main className="screen">
      <div className="panel">
        <div className="badge success" style={{ justifyContent: "center", marginBottom: 16 }}>
          ✓ Account created
        </div>
        <p className="sub" style={{ marginBottom: 24 }}>
          Signed in as {session.user.email}
        </p>

        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, marginBottom: 24 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>One more step</p>
          <p className="sub">
            Verify your identity once with Didit. This unlocks reusable
            verification everywhere.
          </p>
        </div>

        <button className="btn btn-gold" onClick={handleStartKyc} disabled={starting}>
          {starting ? "Starting…" : "Verify my identity"}
        </button>
        <p className="muted" style={{ marginTop: 12 }}>
          Takes about 2 minutes. ID document + a quick face scan.
        </p>
      </div>
    </main>
  );
}
