"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

export default function PrivacyPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Privacy policy</h1>
      <p className="page-intro">
        Our full privacy policy is being finalized. In short: OneKYC never
        stores your ID documents or biometric data — that information is
        processed by our verification provider, Didit, and OneKYC only
        receives a verified/not-verified result. This page will be updated
        with the complete policy before public launch.
      </p>
    </AppShell>
  );
}
