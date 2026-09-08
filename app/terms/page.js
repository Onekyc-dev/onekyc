import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 60px" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <Image src="/logo-mark.png" alt="" width={28} height={28} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>OneKYC</span>
      </Link>

      <h1 className="page-title">Terms of service</h1>
      <p className="page-intro">Last updated: September 2026</p>

      <div className="phase-card">
        <p className="phase-title">What OneKYC is</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          OneKYC lets you verify your identity once and reuse that
          verification across participating dApps. We are not a licensed
          exchange, custodian, bank, or compliance authority, and using
          OneKYC does not substitute for KYC required by a regulated
          service you separately use.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Eligibility</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          You must be at least 18 years old to create an account or use
          OneKYC.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Your account</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          You&apos;re responsible for maintaining access to the Google
          account used to sign in. Identity verification is performed by
          Didit; OneKYC relies on their result and does not independently
          verify your identity.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">No guarantee of outcome</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We don&apos;t guarantee that verification will succeed, or that
          any particular dApp will accept a OneKYC verification. Acceptance
          is at each dApp&apos;s discretion.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Acceptable use</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          You agree not to submit false or someone else&apos;s identity
          documents, attempt to circumvent verification checks, or use
          OneKYC for any unlawful purpose. We may suspend or terminate
          accounts that violate these terms.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Disclaimer and limitation of liability</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          OneKYC is provided &quot;as is,&quot; currently in beta, without
          warranties of any kind. To the fullest extent permitted by law,
          we are not liable for indirect, incidental, or consequential
          damages arising from your use of OneKYC.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Changes to these terms</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          We may update these terms as OneKYC develops. Continued use after
          changes means you accept the updated terms.
        </p>
      </div>

      <div className="phase-card">
        <p className="phase-title">Contact</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Questions about these terms can be sent to [onekyc2026@gmail.com].
        </p>
      </div>
    </main>
  );
}
