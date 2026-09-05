import { useSession, signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sessionId } = useParams();
  const [vSession, setVSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/verify/session/${sessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error("not_found");
        return r.json();
      })
      .then(setVSession)
      .catch(() => setError("This verification link is invalid or has expired."));
  }, [sessionId]);

  if (error) {
    return (
      <main className="screen">
        <div className="panel">
          <p className="error-text" style={{ fontSize: 14 }}>{error}</p>
        </div>
      </main>
    );
  }

  if (!vSession) return null;

  if (vSession.status === "expired") {
    return (
      <main className="screen">
        <div className="panel">
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Link expired</p>
          <p className="sub">Go back to {vSession.dappName} and try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="screen">
      <div className="panel">
        <div className="mark">1</div>
        <h1 className="title">Verification request</h1>
        <p className="sub" style={{ margin: "16px 0 24px" }}>
          <strong style={{ color: "var(--cream)" }}>{vSession.dappName}</strong> wants
          to verify your identity.
        </p>
        <p className="muted" style={{ marginBottom: 24, wordBreak: "break-all" }}>
          Returning to: {vSession.redirectUri}
        </p>

        {status === "authenticated" ? (
          <button
            className="btn btn-gold"
            onClick={() => router.push(`/verify/${sessionId}/liveness`)}
          >
            Continue
          </button>
        ) : (
          <button className="btn btn-gold" onClick={() => signIn("google")}>
            Sign in to continue
          </button>
        )}
        <button
          className="btn btn-ghost"
          style={{ marginTop: 8 }}
          onClick={() => (window.location.href = vSession.redirectUri + "?verified=false&cancelled=true")}
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
