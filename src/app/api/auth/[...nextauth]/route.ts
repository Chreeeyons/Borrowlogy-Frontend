import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {

    async jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/user/login/`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            }
          );
          const data = (await response.json()) as {
            message: string;
            user_type: string;
            user_id: number;
          };

          // Attach user_type to the token
          token.user_type = data.user_type;
          token.user_id = data.user_id;
        } catch (err) {
          console.error("Backend login failed:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (
        session.user &&
        typeof token.user_type === "string" &&
        typeof token.user_id === "number"
      ) {
        session.user.user_type = token.user_type;
        session.user.id = token.user_id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  pages: {
    signIn: "/login", // Optional: custom login page
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
