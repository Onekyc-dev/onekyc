import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Swap this for your own verified domain once you have one, e.g.
// "OneKYC <noreply@onekyc.app>"
const FROM = "OneKYC <onboarding@resend.dev>";

export async function sendVerificationResultEmail(email, passed) {
  if (!process.env.RESEND_API_KEY) return; // no-op until configured

  const subject = passed
    ? "You're verified on OneKYC"
    : "Your OneKYC verification needs another try";

  const html = passed
    ? `<p>Good news — your identity has been verified on OneKYC.</p>
       <p>You can now reuse this verification across any dApp that supports OneKYC.</p>`
    : `<p>We weren't able to confirm your last verification attempt.</p>
       <p>This is usually fixable — a clearer photo of your document or better lighting is often all it takes. You can try again anytime from your dashboard.</p>`;

  try {
    await resend.emails.send({ from: FROM, to: email, subject, html });
  } catch (err) {
    // Never let an email failure break the actual verification flow.
    console.error("Failed to send verification email:", err);
  }
}
