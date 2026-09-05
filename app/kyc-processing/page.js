import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KycProcessingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [state, setState] = useState("processing");

  useEffect(() => {
    if (status !== "authenticated") return;
    const timer = setTimeout(async () => {
      await update();
      setState("verified");
    }, 2200);
    return () => clearTimeout(timer);
  }, [status, update]);

  if (status === "loading") return null;

  return (
    <main className="screen">
      <div className="panel">
        {state === "processing" ? (
          <>
            <div className="spinner" />
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
              Verifying your identity
            </p>
            <p className="sub">Didit is checking your documents. This takes a moment.</p>
          </>
        ) : (
          <>
            <div className="badge success" style={{ justifyContent: "center", marginBottom: 16 }}>
              ✓ You&apos;re verified
            </div>
            <p className="sub" style={{ marginBottom: 20 }}>
              Your identity is confirmed. You won&apos;t need to redo this step again.
            </p>
            <button className="btn btn-gold" onClick={() => router.push("/dashboard")}>
              Go to my dashboard
            </button>
          </>
        )}
      </div>
    </main>
  );
}
