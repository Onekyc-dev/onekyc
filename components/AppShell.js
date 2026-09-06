"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/roadmap", label: "Roadmap", icon: "map" },
  { href: "/docs", label: "Docs", icon: "file-text" },
  { href: "/updates", label: "Updates", icon: "bell" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const LEGAL_ITEMS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

export default function AppShell({ email, children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="icon-btn"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <div className="brand">
            <Image src="/logo-mark.png" alt="" width={26} height={26} />
            <span>OneKYC</span>
          </div>
        </div>
        {email && <span className="topbar-email">{email}</span>}
      </header>

      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      )}

      <nav className={`drawer ${open ? "drawer-open" : ""}`}>
        <div className="brand" style={{ padding: "8px 12px 20px" }}>
          <Image src="/logo-mark.png" alt="" width={26} height={26} />
          <span>OneKYC</span>
        </div>

        {NAV_ITEMS.map((item) => (
          <button key={item.href} className="drawer-item" onClick={() => go(item.href)}>
            {item.label}
          </button>
        ))}

        <div className="drawer-divider" />

        {LEGAL_ITEMS.map((item) => (
          <button key={item.href} className="drawer-item drawer-item-small" onClick={() => go(item.href)}>
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button className="drawer-item drawer-item-danger" onClick={() => signOut()}>
          Sign out
        </button>
      </nav>

      <main className="shell-content">{children}</main>
    </div>
  );
}
