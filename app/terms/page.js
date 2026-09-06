"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

export default function TermsPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Terms of service</h1>
      <p className="page-intro">
        Our full terms of service are being finalized. OneKYC is a
        verification demo — it is not a licensed exchange, custodian, or
        compliance authority. This page will be updated with the complete
        terms before public launch.
      </p>
    </AppShell>
  );
}
