"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyResultPage() {
  const { data: session, status } = useSession();
  const { sessionId } = useParams();
  const [dappName, setDappName] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;

    let redirectUrl = null;

    fetch(`/api/verify/callback/${sessionId}`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setDappName(data.dappName);
        redirectUrl = data.redirectUrl;
        setTimeout(() => {
          if (redirectUrl) window.location.href = redirectUrl;
        }, 1500);
      });
  }, [status, sessionId]);

  if (status === "loading") return null;

  return (
    <main className="screen">
      <div className="panel">
        <div className="badge success" style={{ justifyContent: "center", marginBottom: 16 }}>
          ✓ Verified
        </div>
        <p className="sub">
          Returning you to {dappName || "the app"}…
        </p>
      </div>
    </main>
  );
}
