"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [screen, setScreen] = useState("landing");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session.user.verified) {
      router.push("/dashboard");
    } else {
      router.push("/verify-prompt");
    }
  }, [status, session, router]);

  const handleEmailContinue = async () => {
    // We'll connect this to the OTP API in the next step.
    setScreen("otp");
  };

  const handleOtpVerify = async () => {
    // We'll connect this to NextAuth in the next step.
    const code = otp.join("");

    if (code.length !== 6) return;

    console.log("OTP:", code);
  };

  return (
    <main className="screen landing-screen">

      {screen === "landing" && (
        <>
          <div className="gold-art" aria-hidden="true">
            <div className="globe" />
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
            <span className="wave" />
          </div>

          <div className="screen-inner">

            <div className="auth-top">
              <img
                className="auth-wordmark"
                src="/logo-wordmark.png"
                alt="OneKYC — Verify Once. Trust Everywhere."
              />
            </div>

            <div className="hero-copy">
              <p className="eyebrow">
                Portable identity infrastructure
              </p>

              <h1 className="hero-title">
                Your identity.
                <br />
                <span className="gold">Your control.</span>
              </h1>

              <p className="hero-sub">
                One verification. A lifetime of access. Your KYC, your way.
              </p>
            </div>

            <div className="auth-actions">

              <button
                className="btn btn-gold"
                onClick={() => setScreen("auth")}
                disabled={status === "loading"}
              >
                Get started
                <span className="btn-arrow">→</span>
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => setScreen("auth")}
                disabled={status === "loading"}
              >
                Sign in
              </button>

            </div>

            <p className="consent">
              By continuing you agree to our{" "}
              <a href="/terms">Terms of service</a> and{" "}
              <a href="/privacy">Privacy policy</a>.
            </p>

          </div>
        </>
      )}

      {screen === "auth" && (
        <div className="screen-inner auth-screen">

          <div className="auth-top">
            <img
              className="auth-wordmark"
              src="/logo-wordmark.png"
              alt="OneKYC"
            />
          </div>

          <div className="auth-card">

            <button
              className="auth-back"
              onClick={() => setScreen("landing")}
            >
              ← Back
            </button>

            <h1 className="auth-title">
              Welcome to OneKYC
            </h1>

            <p className="auth-description">
              Continue with your email or Google.
            </p>

            <button
              className="google-btn"
              onClick={() => signIn("google")}
              disabled={status === "loading"}
            >
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <button
              className="btn btn-gold auth-continue"
              onClick={handleEmailContinue}
              disabled={!email.trim()}
            >
              Continue
              <span className="btn-arrow">→</span>
            </button>

          </div>

        </div>
      )}

      {screen === "otp" && (
        <div className="screen-inner auth-screen">

          <div className="auth-top">
            <img
              className="auth-wordmark"
              src="/logo-wordmark.png"
              alt="OneKYC"
            />
          </div>

          <div className="auth-card">

            <button
              className="auth-back"
              onClick={() => setScreen("auth")}
            >
              ← Back
            </button>

            <h1 className="auth-title">
              Check your email
            </h1>

            <p className="auth-description">
              Enter the 6-digit code sent to{" "}
              <strong>{email}</strong>
            </p>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    const nextOtp = [...otp];
                    nextOtp[index] = value;
                    setOtp(nextOtp);
                  }}
                />
              ))}
            </div>

            <button
              className="btn btn-gold auth-continue"
              onClick={handleOtpVerify}
              disabled={otp.join("").length !== 6}
            >
              Verify
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="resend-btn"
              onClick={handleEmailContinue}
            >
              Resend code
            </button>

          </div>

        </div>
      )}

    </main>
  );
}
