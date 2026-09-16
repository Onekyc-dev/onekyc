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

export async function sendLoginOtpEmail(email, code) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const subject = `${code} is your OneKYC verification code`;

  const html = `
    <div style="background:#050505;padding:40px 20px;font-family:Arial,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#0b0b0b;border:1px solid #252525;border-radius:20px;padding:40px;">
        
        <div style="text-align:center;margin-bottom:30px;">
          <strong style="color:#e8b84a;font-size:24px;">
            OneKYC
          </strong>
        </div>

        <h1 style="color:#ffffff;font-size:26px;text-align:center;margin-bottom:12px;">
          Your verification code
        </h1>

        <p style="color:#a6a6a6;text-align:center;font-size:15px;line-height:1.6;">
          Use the code below to continue to your OneKYC account.
        </p>

        <div style="
          margin:30px auto;
          width:max-content;
          padding:18px 28px;
          border:1px solid #e8b8ba;
          border-radius:12px;
          color:#d4af37;
          font-size:32px;
          font-weight:700;
          letter-spacing:10px;
        ">
          ${code}
        </div>

        <p style="color:#777;text-align:center;font-size:13px;">
          This code expires in 5 minutes.
        </p>

        <p style="color:#666;text-align:center;font-size:12px;margin-top:30px;">
          If you didn't request this code, you can safely ignore this email.
        </p>

      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html,
  });
}
