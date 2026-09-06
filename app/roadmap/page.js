"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

const PHASES = [
  {
    title: "Now — MVP",
    items: [
      "Google sign-in and account creation",
      "Didit KYC and liveness verification",
      "Verified OneKYC identity and dashboard",
    ],
  },
  {
    title: "Next — Identity sharing",
    items: [
      "Share your verified identity with a dApp",
      "Choose exactly which fields to share",
      "QR-code verification",
      "Revoke access, expiring permissions",
    ],
  },
  {
    title: "Later — Developer platform",
    items: [
      "Public API for verification requests",
      "API keys and webhooks",
      "Sandbox environment and SDK",
      "Full developer documentation",
    ],
  },
  {
    title: "Future — Identity network",
    items: [
      "Support for more than one verification provider",
      "Portable, privacy-preserving credentials",
      "Business/KYB accounts",
    ],
  },
];

export default function RoadmapPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Roadmap</h1>
      <p className="page-intro">
        Where OneKYC is headed — built in phases, in order, so the core
        stays solid before we add on top of it.
      </p>
      {PHASES.map((phase) => (
        <div key={phase.title} className="phase-card">
          <p className="phase-title">{phase.title}</p>
          <ul className="phase-list">
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </AppShell>
  );
}
