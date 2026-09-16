import { NextResponse } from "next/server";
import { createEmailOtp, createUser, getUserByEmail } from "../../../../lib/db";
import { sendLoginOtpEmail } from "../../../../lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let user = await getUserByEmail(email);

    if (!user) {
      user = await createUser({
        email,
        name: null,
      });
    }

    const code = await createEmailOtp(email);

    await sendLoginOtpEmail(email, code);

    return NextResponse.json({
      success: true,
      message: "Verification code sent.",
    });
  } catch (error) {
    console.error("OTP request failed:", error);

    return NextResponse.json(
      { error: "Unable to send verification code." },
      { status: 500 }
    );
  }
}
