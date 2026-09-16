"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ERROR_MESSAGES = {
  missing: "Please enter the 6-digit code.",
  invalid: "That code isn't right. Please try again.",
  expired: "This code has expired. Request a new one.",
  too_many_attempts: "Too many attempts. Request a new code.",
  CredentialsSignin: "That code isn't right. Please try again.",
};

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [screen, setScreen] = useState("landing");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.verified) router.push("/dashboard");
    else router.push("/verify-prompt");
  }, [status, session, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function requestCode() {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSending(true);
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setCooldown(60);
    setScreen("otp");
  }

  function handleOtpChange(i, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length) {
      e.preventDefault();
      setOtp([...digits, ...Array(6 - digits.length).fill("")]);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  }

  async function verifyCode() {
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setSending(true);
    const res = await signIn("credentials", { email, otp: code, redirect: false });
    setSending(false);

    if (res?.error) {
      setError(ERROR_MESSAGES[res.error] || "Something went wrong.");
    }
    // On success, useSession() updates automatically and the effect above redirects.
  }

  if (screen === "landing") {
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
            <button className="btn btn-gold" onClick={() => setScreen("auth")}>
              Sign up <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-ghost" onClick={() => setScreen("auth")}>
              Log in
            </button>
          </div>

          <p className="consent">
            By continuing you agree to our <a href="/terms">Terms of service</a> and <a href="/privacy">Privacy policy</a>.
          </p>
        </div>
      </main>
    );
  }

  if (screen === "auth") {
    return (
      <main className="screen">
        <div className="screen-inner">
          <button className="icon-btn" onClick={() => setScreen("landing")} aria-label="Back">←</button>

          <div className="hero-copy" style={{ marginTop: 20 }}>
            <h1 className="hero-title" style={{ fontSize: 24 }}>Continue to OneKYC</h1>
            <p className="hero-sub">We&apos;ll send a code to confirm it&apos;s you.</p>
          </div>

          <div style={{ marginTop: 24 }}>
            <input
              type="email"
              className="field"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />
            {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
            <button className="btn btn-gold" onClick={requestCode} disabled={sending} style={{ width: "100%" }}>
              {sending ? "Sending…" : "Continue"}
            </button>
          </div>

          <div className="or">or</div>

          <button
            className="btn btn-ghost google-btn"
            onClick={() => signIn("google")}
            style={{ width: "100%" }}
          >
            Continue with Google
          </button>

          <p className="consent">
            By continuing you agree to our <a href="/terms">Terms of service</a> and <a href="/privacy">Privacy policy</a>.
          </p>
        </div>
      </main>
    );
  }

  // screen === "otp"
  return (
    <main className="screen">
      <div className="screen-inner">
        <button className="icon-btn" onClick={() => setScreen("auth")} aria-label="Back">←</button>

        <div className="hero-copy" style={{ marginTop: 20 }}>
          <h1 className="hero-title" style={{ fontSize: 24 }}>Enter the code</h1>
          <p className="hero-sub">Sent to {email}</p>
        </div>

        <div className="otp-row" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpRefs.current[i] = el)}
              className="otp-box"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
            />
          ))}
        </div>

        {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-gold" onClick={verifyCode} disabled={sending} style={{ width: "100%" }}>
          {sending ? "Verifying…" : "Verify"}
        </button>

        <p className="resend">
          Didn&apos;t get it?{" "}
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); requestCode(); }}>Resend code</a>
          )}
        </p>
      </div>
    </main>
  );
}
