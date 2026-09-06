import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, createUser } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Runs whenever a user signs in. We use this to make sure every
    // Google login has a matching OneKYC account row (created on first
    // login), and to check whether they've completed Didit KYC yet.
    async signIn({ user }) {
      let account = await getUserByEmail(user.email);
      if (!account) {
        account = await createUser({ email: user.email, name: user.name });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const account = await getUserByEmail(user.email);
        token.verified = account?.verified ?? false;
        token.userId = account?.id ?? null;
        token.oneKycId = account?.oneKycId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.verified = token.verified;
      session.user.id = token.userId;
      session.user.oneKycId = token.oneKycId;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
