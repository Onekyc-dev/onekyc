"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

export default function DocsPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Docs</h1>
      <p className="page-intro">
        How a dApp integrates with OneKYC to verify a user.
      </p>

      <div className="phase-card">
        <p className="phase-title">1. Start a verification session</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Call <code>POST /api/verify/request</code> with a JSON body of{" "}
          <code>{"{ dappName, redirectUri }"}</code>. You&apos;ll get back a{" "}
          <code>redirectUrl</code> — send your user there.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">2. User completes verification</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          The user logs into OneKYC and completes a fresh liveness check.
          You don&apos;t need to build any of this UI yourself.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">3. Receive the result</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          OneKYC redirects back to your <code>redirectUri</code> with{" "}
          <code>?verified=true&amp;token=...</code>. Verify the token&apos;s
          signature server-side before trusting it.
        </p>
      </div>

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
        Full API reference and a public developer dashboard are coming as
        part of the developer platform phase — see the roadmap.
      </p>
    </AppShell>
  );
}
