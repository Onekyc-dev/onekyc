"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/roadmap", label: "Roadmap", icon: "◇" },
  { href: "/docs", label: "Docs", icon: "▤" },
  { href: "/updates", label: "Updates", icon: "◌" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

const LEGAL_ITEMS = [
  { href: "/privacy", label: "Privacy policy", icon: "♢" },
  { href: "/terms", label: "Terms of service", icon: "▤" },
];

export default function AppShell({ email, children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-btn" aria-label="Open menu" onClick={() => setOpen(true)}>☰</button>
          <div className="brand">
            <Image src="/logo-mark.png" alt="" width={30} height={30} />
            <span>OneKYC</span>
          </div>
        </div>
        {email && <span className="topbar-email">{email}</span>}
      </header>

      {open && <div className="drawer-backdrop" onClick={() => setOpen(false)} />}

      <nav className={`drawer ${open ? "drawer-open" : ""}`} aria-label="Main navigation">
        <div className="drawer-head">
          <div className="brand"><Image src="/logo-mark.png" alt="" width={32} height={32} /><span>OneKYC</span></div>
          <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        </div>

        {NAV_ITEMS.map((item) => (
          <button key={item.href} className={`drawer-item ${pathname === item.href ? "active" : ""}`} onClick={() => go(item.href)}>
            <span className="drawer-icon">{item.icon}</span>{item.label}
          </button>
        ))}

        <div className="drawer-divider" />
        {LEGAL_ITEMS.map((item) => (
          <button key={item.href} className="drawer-item drawer-item-small" onClick={() => go(item.href)}>
            <span className="drawer-icon">{item.icon}</span>{item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button className="drawer-item drawer-item-danger" onClick={() => signOut()}>
          <span className="drawer-icon">↪</span>Sign out
        </button>
      </nav>

      <main className="shell-content">{children}</main>
    </div>
  );
}
