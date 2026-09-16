import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import {
  getUserByEmail,
  createUser,
  verifyEmailOtp,
} from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Email OTP",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        otp: {
          label: "Verification code",
          type: "text",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim()?.toLowerCase();
        const otp = credentials?.otp?.trim();

        if (!email || !otp) {
          return null;
        }

        const result = await verifyEmailOtp(email, otp);

        if (!result.success) {
          return null;
        }

        let account = await getUserByEmail(email);

        if (!account) {
          account = await createUser({
            email,
            name: null,
          });
        }

        return {
          id: account.id,
          email: account.email,
          name: account.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      let account = await getUserByEmail(user.email);

      if (!account) {
        account = await createUser({
          email: user.email,
          name: user.name,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const account = await getUserByEmail(user.email);

        token.verified = account?.verified ?? false;
        token.userId = account?.id ?? null;
        token.oneKycId = account?.oneKycId ?? null;
        token.verifiedAt = account?.verifiedAt ?? null;
        token.verificationStatus =
          account?.verificationStatus ?? "none";
        token.flaggedDuplicate =
          account?.flaggedDuplicate ?? false;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.verified = token.verified;
      session.user.id = token.userId;
      session.user.oneKycId = token.oneKycId;
      session.user.verifiedAt = token.verifiedAt;
      session.user.verificationStatus =
        token.verificationStatus;
      session.user.flaggedDuplicate =
        token.flaggedDuplicate;

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};
