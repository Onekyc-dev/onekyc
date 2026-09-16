import {NextResponse } from "next/server";
import { createEmailOtp, getLatestOtpChallenge } from "../../../../lib/db";
import { sendLoginOtpEmail } from "../../../../lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const latest = await getLatestOtpChallenge(email);
    if (latest && Date.now() - new Date(latest.created_at).getTime() < 60 * 1000) {
      return Response.json({ error: "Please wait a moment before requesting another code." }, { status: 429 });
    }

    const code = await createEmailOtp(email);
    await sendLoginOtpEmail(email, code);

    return Response.json({ success: true });
  } catch (error) {
    console.error("OTP request failed:", error);
    return Response.json({ error: "Unable to send verification code." }, { status: 500 });
  }
}
