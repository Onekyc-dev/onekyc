"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AppShell from "../../components/AppShell";

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      update();
    }
  }, [status, update]);

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
      {session.user.verified && (
        <div className="status-banner">
          <div>
            <p className="status-title">Verified</p>
            <p className="status-sub">
              Since {session.user.verifiedAt ? new Date(session.user.verifiedAt).toLocaleDateString() : ""}
            </p>
          </div>
          <span className="status-id">
            {session.user.oneKycId}
          </span>
        </div>
      )}

      {session.user.verificationStatus === "in_review" && (
        <div className="status-banner" style={{ background: "rgba(212,175,55,0.1)" }}>
          <div>
            <p className="status-title" style={{ color: "var(--gold)" }}>In review</p>
            <p className="status-sub" style={{ color: "var(--gold)" }}>We&apos;re checking your submission — this can take a moment</p>
          </div>
        </div>
      )}

      {session.user.verificationStatus === "flagged" && (
        <div className="status-banner" style={{ background: "rgba(212,175,55,0.1)" }}>
          <div>
            <p className="status-title" style={{ color: "var(--gold)" }}>Under review</p>
            <p className="status-sub" style={{ color: "var(--gold)" }}>Your verification needs a closer look — we&apos;ll update you soon</p>
          </div>
        </div>
      )}

      {session.user.verificationStatus === "declined" && (

        <div className="status-banner" style={{ background: "rgba(248,113,113,0.1)" }}>
          <div>
            <p className="status-title" style={{ color: "var(--danger)" }}>Needs resubmission</p>
            <p className="status-sub" style={{ color: "var(--danger)" }}>Your last attempt couldn&apos;t be confirmed — try again with a clearer photo</p>
          </div>
          <button className="btn btn-gold" style={{ width: "auto", padding: "8px 16px" }} onClick={() => router.push("/verify-prompt")}>
            Resubmit
          </button>
        </div>
      )}

      {(!session.user.verified && session.user.verificationStatus === "none") && (
        <div className="status-banner" style={{ background: "rgba(248,113,113,0.1)" }}>
          <div>
            <p className="status-title" style={{ color: "var(--danger)" }}>Not verified yet</p>
            <p className="status-sub" style={{ color: "var(--danger)" }}>Complete identity verification to unlock everything</p>
          </div>
          <button className="btn btn-gold" style={{ width: "auto", padding: "8px 16px" }} onClick={() => router.push("/verify-prompt")}>
            Verify
          </button>
        </div>
      )}

      <div className="dashboard-main">
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
        <span className="teaser-icon">▦</span>
      </div>

      <div className="teaser-card">
        <div>
          <p className="teaser-title">Developer API</p>
          <p className="teaser-sub">Coming soon</p>
        </div>
        <span className="teaser-icon">&lt;/&gt;</span>
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
      </div>
    </AppShell>
  );
}
