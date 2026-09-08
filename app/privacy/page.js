"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

export default function PrivacyPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Privacy policy</h1>
      <p className="page-intro">Last updated: September 2026</p>

      <div className="phase-card">
        <p className="phase-title">What we collect</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          When you sign in with Google, we receive your email address and
          name. We generate a unique OneKYC ID for your account and store
          your verification status (verified or not), the date you were
          verified, and a history of which dApps you&apos;ve verified with
          (dApp name and timestamp only).
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">What we don&apos;t collect</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          OneKYC never stores your ID documents, photos, selfies, or any
          biometric data. Document scans and liveness checks are processed
          entirely by our verification provider, Didit — we only ever
          receive a verified / not-verified result back, not the underlying
          documents or images.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Third-party processors</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We use Google for sign-in, Didit for identity verification, and
          Supabase to store the account data described above. Each of these
          providers processes data under their own privacy policies, which
          we encourage you to review.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">When a dApp verifies you</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          When you verify with a dApp through OneKYC, we send that dApp a
          signed confirmation that you&apos;re verified — never your
          documents, photos, or personal details. We log which dApp you
          verified with and when, visible to you on your dashboard.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Data retention and deletion</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We retain your account data for as long as your account is
          active. To request deletion of your account and associated data,
          contact us using the details below.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Contact</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Questions about this policy or your data can be sent to [onekyc2026@gmail.com
          ].
        </p>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
        OneKYC is currently in beta. This policy will be expanded as the
        product develops.
      </p>
    </AppShell>
  );
}
