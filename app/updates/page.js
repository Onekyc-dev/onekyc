"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

const UPDATES = [
  {
    date: "September 2026",
    title: "OneKYC is live",
    body: "Google sign-in, identity verification, and your dashboard are up and running.",
  },
];

export default function UpdatesPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Updates</h1>
      <p className="page-intro">What&apos;s new with OneKYC.</p>
      {UPDATES.map((u) => (
        <div key={u.title} className="phase-card">
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{u.date}</p>
          <p className="phase-title">{u.title}</p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{u.body}</p>
        </div>
      ))}
    </AppShell>
  );
}
