"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.verified) {
      router.push("/dashboard");
    } else {
      router.push("/verify-prompt");
    }
  }, [status, session, router]);

  return (
    <main className="screen">
      <div className="panel">
        <div className="mark">1</div>
        <h1 className="title">OneKYC</h1>
        <p className="tagline">VERIFY ONCE. TRUST EVERYWHERE.</p>

        <button
          className="btn btn-gold"
          onClick={() => signIn("google")}
          disabled={status === "loading"}
        >
          Continue with Google
        </button>

        <p className="sub" style={{ marginTop: 16 }}>
          You&apos;ll verify your ID once with Didit, then reuse it anywhere.
        </p>

        <p className="muted" style={{ marginTop: 24 }}>
          By continuing you agree to complete identity verification. Not a
          licensed exchange or custodian.
        </p>
      </div>
    </main>
  );
}
