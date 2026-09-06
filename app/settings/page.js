"use client";

import { useSession } from "next-auth/react";
import AppShell from "../../components/AppShell";

export default function SettingsPage() {
  const { data: session } = useSession();
  return (
    <AppShell email={session?.user?.email}>
      <h1 className="page-title">Settings</h1>
      <p className="page-intro">
        Account settings are coming soon — for now, you can sign out from
        the menu.
      </p>
    </AppShell>
  );
}
