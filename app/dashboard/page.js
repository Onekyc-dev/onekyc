"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/me/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.history ?? []));
  }, [status]);

  if (status !== "authenticated") return null;

  const daysVerified = session.user.verifiedAt
    ? Math.max(0, Math.floor((Date.now() - new Date(session.user.verifiedAt)) / 86400000))
    : 0;

  return (
    <AppShell email={session.user.email}>
      <div className="status-banner">
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, color: "var(--success)" }}>Verified</p>
          <p style={{ fontSize: 12, color: "var(--success)" }}>
            Since {session.user.verifiedAt ? new Date(session.user.verifiedAt).toLocaleDateString() : "today"}
          </p>
        </div>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--success)" }}>
          {session.user.oneKycId}
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">dApps verified with</p>
          <p className="stat-value">{history.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Verification age</p>
          <p className="stat-value">{daysVerified}d</p>
        </div>
      </div>

      <div className="teaser-card">
        <div>
          <p className="teaser-title">Share my identity</p>
          <p className="teaser-sub">Coming soon</p>
        </div>
        <span style={{ fontSize: 20 }}>▦</span>
      </div>

      <div className="teaser-card">
        <div>
          <p className="teaser-title">Developer API</p>
          <p className="teaser-sub">Coming soon</p>
        </div>
        <span style={{ fontSize: 20 }}>{"</>"}</span>
      </div>

      <p className="section-label">Verification history</p>
      {history.length === 0 && <p className="muted">No dApps verified yet.</p>}
      {history.map((h, i) => (
        <div key={i} className="history-row">
          <div>
            <p style={{ fontSize: 13, fontWeight: 500 }}>{h.dappName}</p>
            <p className="muted">{new Date(h.timestamp).toLocaleString()}</p>
          </div>
          <span style={{ color: "var(--success)" }}>✓</span>
        </div>
      ))}
    </AppShell>
  );
}
