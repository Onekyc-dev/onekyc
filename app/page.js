"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.verified) router.push("/dashboard");
    else router.push("/verify-prompt");
  }, [status, session, router]);

  return (
    <main className="screen landing-screen">
      <div className="gold-art" aria-hidden="true">
        <div className="globe" />
        <span className="wave" /><span className="wave" /><span className="wave" />
        <span className="wave" /><span className="wave" />
      </div>

      <div className="screen-inner">
        <div className="auth-top">
          <img className="auth-wordmark" src="/logo-wordmark.png" alt="OneKYC — Verify Once. Trust Everywhere." />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Portable identity infrastructure</p>
          <h1 className="hero-title">Your identity.<br /><span className="gold">Your control.</span></h1>
          <p className="hero-sub">One verification. A lifetime of access. Your KYC, your way.</p>
        </div>

        <div className="auth-actions">
          <button className="btn btn-gold" onClick={() => signIn("google")} disabled={status === "loading"}>
            Get started <span className="btn-arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => signIn("google")} disabled={status === "loading"}>
            Sign in
          </button>
        </div>

        <p className="consent">
          By continuing you agree to our <a href="/terms">Terms of service</a> and <a href="/privacy">Privacy policy</a>.
        </p>
      </div>
    </main>
  );
}
