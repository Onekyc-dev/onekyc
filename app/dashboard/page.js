import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/me/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.history ?? []));
  }, [status]);

  if (status !== "authenticated") return null;

  return (
    <main className="screen">
      <div className="panel" style={{ textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="mark" style={{ width: 34, height: 34, fontSize: 15, margin: 0 }}>1</div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>OneKYC</span>
          </div>
          <button className="btn-ghost" style={{ border: "none", background: "none", color: "var(--muted)", fontSize: 12, cursor: "pointer" }} onClick={() => signOut()}>
            Sign out
          </button>
        </div>

        <div className="badge success" style={{ marginBottom: 16 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Verified</p>
            <p style={{ fontSize: 12 }}>Since {session.user.verifiedAt ? new Date(session.user.verifiedAt).toLocaleDateString() : "today"}</p>
          </div>
        </div>

        <p className="muted" style={{ marginBottom: 10, fontWeight: 600 }}>Verification history</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {history.length === 0 && (
            <p className="muted">No dApps verified yet.</p>
          )}
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{h.dappName}</p>
                <p className="muted">{new Date(h.timestamp).toLocaleString()}</p>
              </div>
              <span style={{ color: "var(--success)" }}>✓</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
