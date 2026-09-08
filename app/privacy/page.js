import Image from "next/image";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 60px" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <Image src="/logo-mark.png" alt="" width={28} height={28} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>OneKYC</span>
      </Link>

      <h1 className="page-title">Privacy policy</h1>
      <p className="page-intro">Last updated: September 2026</p>

      <div className="phase-card">
        <p className="phase-title">What we collect</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          When you sign in with Google, we receive your email address and
          name. We generate a unique OneKYC ID for your account and store
          your verification status (verified or not), the date you were
          verified, and a history of which dApps you&apos;ve verified with
          (dApp name and timestamp only).
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">What we don&apos;t store</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          OneKYC&apos;s own systems never store your ID documents, photos,
          selfies, or biometric data — our database only ever receives a
          verified / not-verified result, never the underlying documents
          or images.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Human review access</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Document scans, selfies, and location data are processed by our
          verification provider, Didit. Authorized OneKYC personnel can
          access this data through Didit&apos;s console for manual review —
          for example, when a submission is unclear or flagged for
          additional checks. This access is limited to what&apos;s needed
          for review and is not stored in OneKYC&apos;s own database.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Third-party processors</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We use Google for sign-in, Didit for identity verification, and
          Supabase to store the account data described above. Each of these
          providers processes data under their own privacy policies, which
          we encourage you to review.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">When a dApp verifies you</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          When you verify with a dApp through OneKYC, we send that dApp a
          signed confirmation that you&apos;re verified — never your
          documents, photos, or personal details. We log which dApp you
          verified with and when, visible to you on your dashboard.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Data retention and deletion</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We retain your account data for as long as your account is
          active. To request deletion of your account and associated data,
          contact us using the details below.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Contact</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Questions about this policy or your data can be sent to [onekyc2026@gmail.com
          ].
        </p>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
        OneKYC is currently in beta. This policy will be expanded as the
        product develops.
      </p>
    </main>
  );
}
